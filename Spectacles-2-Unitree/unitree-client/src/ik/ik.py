import asyncio
import logging
import time
from collections import deque
from enum import Enum

import numpy as np
from PIL import Image
from scipy.spatial.transform import Rotation

from ik.g1_controller import G1_29_ArmController, G1_29_JointArmIndex
from ik.g1_solver import G1_29_ArmIK


def fast_mat_inv(mat: np.ndarray) -> np.ndarray:
    """
    Fast matrix inversion for 4x4 matrices.
    """
    if mat.shape != (4, 4):
        msg = "Input matrix must be 4x4."
        raise ValueError(msg)
    ret = np.eye(4)
    ret[:3, :3] = mat[:3, :3].T
    ret[:3, 3] = -mat[:3, :3].T @ mat[:3, 3]
    return ret


# Spectacles world space (X right, Y up, Z back) to robot world space (X front, Y left, Z up)
R_specs_to_robot = np.array([[0, 0, -1], [-1, 0, 0], [0, 1, 0]])
T_specs_to_robot = np.eye(4)
T_specs_to_robot[:3, :3] = R_specs_to_robot
T_specs_to_robot_inv = fast_mat_inv(T_specs_to_robot)

# Spectacles left wrist
# - X right, back to palm
# - Y up, pinky to index
# - Z back, wrist to middle
#
# Robot left wrist:
# - X wrist to middle
# - Y palm to back
# - Z pinky to index
#
R_specs_wrist_to_robot_left = Rotation.from_euler(
    "xyz", [90, -90, 0], degrees=True
).as_matrix()
T_local_fix_left = np.eye(4)
T_local_fix_left[:3, :3] = R_specs_wrist_to_robot_left

# Spectacles right wrist:
# - X right, back to palm
# - Y up, pinky to index
# - Z back, wrist to middle
#
# Robot right wrist:
# - X wrist to middle
# - Y back to palm
# - Z pinky to index
R_specs_wrist_to_robot_right = Rotation.from_euler(
    "xyz", [90, 90, 0], degrees=True
).as_matrix()
T_local_fix_right = np.eye(4)
T_local_fix_right[:3, :3] = R_specs_wrist_to_robot_right

# For G1 initial position
const_right_wrist_default = np.array(
    [[1, 0, 0, 0.15], [0, 1, 0, 1.13], [0, 0, 1, -0.3], [0, 0, 0, 1]]
)

# For G1 initial position
const_left_wrist_default = np.array(
    [[1, 0, 0, -0.15], [0, 1, 0, 1.13], [0, 0, 1, -0.3], [0, 0, 0, 1]]
)

# Offset, in meters, from the robot's world origin (its waist) to the robot's head.
T_robot_origin_to_robot_head = np.array(
    [
        [1, 0, 0, 0.15],  # Translation in X by 0.15m
        [0, 1, 0, 0],  # Translation in Y by 0m
        [0, 0, 1, 0.45],  # Translation in Z by 0.45m
        [0, 0, 0, 1],
    ]
)


class RobotHandType(Enum):
    DEX3 = "./urdf/dex_hand/unitree_dex3.yml"


class HandMovement:
    type: str = "hand_movement"
    # The hand, either "left" or "right"
    handType: str = ""
    # Spectacles data.
    _rawWristTransform: np.ndarray
    # Spectacles data. These are already relative to the wrists.
    _rawFingerPositions: np.ndarray
    # Spectacles data.
    _rawHeadTransform: np.ndarray
    timestamp: int = 0
    # Head pose in Robot space
    headMat: np.ndarray = np.eye(4)
    # Left wrist position and rotation in robot space
    leftWristMat: np.ndarray = np.copy(const_left_wrist_default)
    # Right wrist position and rotation in robot space
    rightWristMat: np.ndarray = np.copy(const_right_wrist_default)
    # Left hand finger positions in left-wrist space. Dex3 joint order: thumb_0, thumb_1, thumb_2, middle_0, middle_1, index_0, index_1
    leftHandFingerPos: np.ndarray | None = None
    # Right hand finger positions in right-wrist space. Dex3 joint order: thumb_0, thumb_1, thumb_2, middle_0, middle_1, index_0, index_1
    rightHandFingerPos: np.ndarray | None = None

    # TODO: Switch calculation method based on head position over time.
    # 1. In Spectacles space, wrists are relatively static, head position is relatively static, but head rotation is changing.
    #    - Example: hands stationary on a keyboard but looking left and right.
    #    - Method: keep using the wrist's last position.
    # 2. In Spectacles space, wrists position is changing, head position is changing.
    #    - Example: holding hands steady in front of the body and walking around.
    #    - Method: use the wrist's current **relative** position.

    def __init__(self, data: dict):
        self.handType = data.get("handType", "")
        self.timestamp = data.get("timestamp", 0)

        # The "transform" key is expected to be a list where:
        #   - The first element is the flattened 4x4 wrist transform, column-major.
        #   - Next elements are 3D finger positions.
        #   - Last element is a flatteend 4x4 for head transform, column-major.
        transform = data.get("transform", [])
        if not transform or len(transform) < 3:
            msg = "Invalid data: missing transform information."
            raise ValueError(msg)

        #
        # Extract and scale.
        #

        # Head transform
        self._rawHeadTransform = np.array(transform[-1]).reshape(4, 4).T
        self._rawHeadTransform[0:3, 3] /= 100.0  # cm -> m

        # Wrist transform
        self._rawWristTransform = np.array(transform[0]).reshape(4, 4).T
        self._rawWristTransform[0:3, 3] /= 100.0  # cm -> m

        # Finger positions -- these are already relative to the wrist transform in Spectacles space.
        self._rawFingerPositions = np.array(transform[1:-1]).reshape(-1, 3)
        self._rawFingerPositions /= 100.0  # cm -> m

        #
        # Convert from Spectacles AR coordinate space to Robot space.
        #

        # Head and Wrists

        # 1. Apply local wrist rotation in the Spectacles space so they'll line up when we switch to the Robot space.

        # Select proper local wrist frame correction.
        if self.handType == "left":
            T_local_fix = T_local_fix_left
        elif self.handType == "right":
            T_local_fix = T_local_fix_right
        else:
            msg = f"Invalid hand type: {self.handType}. Expected 'left' or 'right'."
            raise ValueError(msg)

        T_Spectacles_wrist_rotated = self._rawWristTransform @ T_local_fix

        # 2. Calculate wrist transform relative to head in Spectacles space.
        T_Spectacles_wrist_rel_head = (
            fast_mat_inv(self._rawHeadTransform) @ T_Spectacles_wrist_rotated
        )

        # 3. Transform the relative wrist pose from Spectacles space to Robot space.
        T_robot_wrist_origin = (
            T_specs_to_robot @ T_Spectacles_wrist_rel_head @ T_specs_to_robot.T
        )

        # 4. Translate relative to the robot's head.
        T_Robot_wrist_target = T_robot_origin_to_robot_head @ T_robot_wrist_origin

        if self.handType == "left":
            self.leftWristMat = T_Robot_wrist_target
        elif self.handType == "right":
            self.rightWristMat = T_Robot_wrist_target
        else:
            msg = f"Invalid hand type: {self.handType}. Expected 'left' or 'right'."
            raise ValueError(msg)

        if self.handType == "left":
            indices = [
                3,  # Spectacles thumb-3 -> Dex3 thumb_tip
                19,  # Spectacles pinky-3 -> Dex3 index_tip
                7,  # Spectacles index-3 -> Dex3 middle_tip
            ]
        elif self.handType == "right":
            indices = [
                3,  # Spectacles thumb-3 -> Dex3 thumb_tip
                7,  # Spectacles index-3 -> Dex3 index_tip
                19,  # Spectacles pinky-3 -> Dex3 middle_tip
            ]
        else:
            msg = f"Invalid hand type: {self.handType}. Expected 'left' or 'right'."
            raise ValueError(msg)

        finger_joints = self._rawFingerPositions[indices]


class IK:
    def __init__(self, ik_solver):
        """
        Initialize the IK transformer and solver.

        :param ik_solver: An instance of an IK solver that implements a method `solve_ik`.
        :param t: Transformation matrix from user head to robot base (waist).
        """
        self.ik_solver = ik_solver

    def compute_ik(
        self,
        left: np.ndarray,
        right: np.ndarray,
        current_q: np.ndarray,
        current_dq: np.ndarray,
    ):
        """
        Computes the IK solution with left and right wrist and hand matrices.

        :param left: numpy array representing the left wrist and hand matrices.
        :param right: numpy array representing the right wrist and hand matrices.
        :param current_q: numpy array representing the current joint configuration.
        :param current_dq: numpy array representing the current joint velocities.
        :return: Tuple (q_sol, tauff_sol) from the IK solver.
        """
        # Transform both wrist transforms from the Spectacles (user head) frame into the robot base frame.

        # Call the IK solver using the transformed wrist targets.
        q_sol, tauff_sol = self.ik_solver.solve_ik(left, right, current_q, current_dq)
        return q_sol, tauff_sol


class ArmsAndHands:
    def __init__(self, ik_solver=None, arm_controller=None, mock=False):
        """
        Initialize the Arms and Hands controller.

        If no controller is provided and mock is False, it will attempt to create a new controller instance.

        :param ik_solver: An instance of an IK solver.
        :param arm_controller: An instance of the robot's low-level arm controller.
        """
        if ik_solver is None:
            ik_solver = G1_29_ArmIK(Unit_Test=mock, Visualization=True)
        if arm_controller is None:
            if not mock:
                try:
                    self.controller = G1_29_ArmController()
                except Exception:
                    logging.exception(
                        "Failed to initialize default robot controller, falling back to mock."
                    )
                    self.mock = True
                    self.controller = None
            else:
                self.controller = None
        else:
            self.controller = arm_controller
        self.ik = IK(ik_solver)
        self.current_q = np.array([0.0 for i in G1_29_JointArmIndex])
        self.current_dq = np.array([0.0 for i in G1_29_JointArmIndex])
        self.q_sol = None
        self.tauff_sol = None
        self.left_wrist_transform = np.eye(4)
        self.right_wrist_transform = np.eye(4)
        self.computing_ik_lock = asyncio.Lock()

        # Add timing tracking for performance monitoring
        self.logger = logging.getLogger("ArmsAndHands")
        self.message_timestamps = deque(maxlen=30)  # Store last 30 message timestamps
        self.processing_times = deque(maxlen=30)  # Store last 30 processing times
        self.last_log_time = 0
        self.log_interval = 5.0  # Log performance stats every 5 seconds

    async def move(self, movement: HandMovement, mock: bool = False):
        """
        Move the arms and hands based on the provided movement data.
        This method is debounced - if it's called while a previous IK computation
        is in progress, the new call will be skipped.

        :param movement: An instance of HandMovement containing wrist and finger data.
        :param mock: If True, the function will not send commands to the robot but will still run the IK solver.
        :return: Boolean indicating whether the movement was processed or skipped.
        """
        # Track incoming message timestamp
        current_time = time.time()
        self.message_timestamps.append(current_time)

        # Update the target wrist transforms regardless of whether we'll compute IK
        if movement.handType == "left":
            self.left_wrist_transform = movement.leftWristMat
        elif movement.handType == "right":
            self.right_wrist_transform = movement.rightWristMat

        # Try to acquire the lock without blocking
        if self.computing_ik_lock.locked():
            # Lock is already held, skip this update
            return False

        async with self.computing_ik_lock:
            start_time = time.time()

            # Get current joint positions and velocities
            self.current_q = (
                self.controller.get_current_dual_arm_q() if not mock else self.current_q
            )
            self.current_dq = (
                self.controller.get_current_dual_arm_dq()
                if not mock
                else self.current_dq
            )

            # Compute IK solution
            self.q_sol, self.tauff_sol = self.ik.compute_ik(
                self.left_wrist_transform,
                self.right_wrist_transform,
                self.current_q,
                self.current_dq,
            )

            # Apply the solution
            if not mock:
                self.controller.ctrl_dual_arm(self.q_sol, self.tauff_sol)
            else:
                # Update current q and dq for mock mode
                self.current_q = self.q_sol
                self.current_dq = self.tauff_sol

            # Calculate and store processing time
            end_time = time.time()
            processing_time = end_time - start_time
            self.processing_times.append(processing_time)

            # Log performance stats periodically
            if (
                end_time - self.last_log_time >= self.log_interval
                and len(self.message_timestamps) > 1
            ):
                self.last_log_time = end_time

                # Calculate incoming message rate (messages per second)
                if len(self.message_timestamps) >= 2:
                    time_span = self.message_timestamps[-1] - self.message_timestamps[0]
                    msg_rate = (
                        (len(self.message_timestamps) - 1) / time_span
                        if time_span > 0
                        else 0
                    )
                else:
                    msg_rate = 0

                # Calculate average processing time
                avg_processing_time = (
                    sum(self.processing_times) / len(self.processing_times)
                    if self.processing_times
                    else 0
                )

                # Calculate real-time ratio (processing time / message interval)
                real_time_ratio = avg_processing_time * msg_rate if msg_rate > 0 else 0

                self.logger.info(
                    f"IK Performance: Avg processing time: {avg_processing_time:.4f}s, "
                    f"Message rate: {msg_rate:.2f} msg/s, Real-time ratio: {real_time_ratio:.2f} "
                )

            return True

    def reset(self):
        """
        Reset the arm and hand controller to its initial state.
        """
        if self.controller is not None:
            self.controller.resume_publish_thread()
            self.controller.ctrl_dual_arm_go_home()
        self.left_wrist_transform = np.eye(4)
        self.right_wrist_transform = np.eye(4)
        self.current_q = None
        self.current_dq = None
        self.q_sol = None
        self.tauff_sol = None

    async def render(self, x=0, y=0, z=0, w=1) -> Image:
        """
        Render image of movement via meshcat
        """
        return await asyncio.to_thread(self.ik.ik_solver.capture_frame, x, y, z, w)
