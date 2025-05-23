#!/usr/bin/env python3
import argparse
import asyncio
import datetime
import json
import logging
import signal
import struct
import time
from enum import Enum

import ik.ik
import numpy as np
import websockets
from PIL import Image, ImageDraw, ImageFont
from unitree_sdk2py.core.channel import ChannelFactoryInitialize
from unitree_sdk2py.g1.audio.g1_audio_client import AudioClient
from unitree_sdk2py.g1.loco.g1_loco_client import LocoClient

# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger("robot_client")

# Client statuses
STATUS_DISCONNECTED = "disconnected"
STATUS_WAITING = "waiting"
STATUS_PAIRED = "paired"

# Configuration constants
FORWARD_SPEED = 0.3  # Forward/backward speed in m/s
LATERAL_SPEED = 0.2  # Left/right speed in m/s
ROTATION_SPEED = 0.6  # Rotation speed in rad/s


class RobotState(str, Enum):
    LOW_LEVEL = "basic_service"
    HIGH_LEVEL = "ai_sport"


class Robot:
    """
    A wrapper around the unitree LocoClient, AudioClient, and the ArmsAndHands class.
    """

    def __init__(self, mode: RobotState, mock: bool = True):
        self.mock = mock
        self._motion_state = mode
        if not mock:
            ChannelFactoryInitialize(0, "eth0")
            # logger.info("Initializing MotionSwitcherClient...")
            # self._motion_switcher = MotionSwitcherClient()
            # self._motion_switcher.Init()
            if self._motion_state == RobotState.HIGH_LEVEL:
                logger.info(
                    "Starting client with real robot control, high-level (locomotion) API mode..."
                )
                logger.info("Initializing LocoClient and AudioClient...")
                self._loco = LocoClient()
                self._loco.SetTimeout(10.0)
                self._loco.Init()
                self._audio = AudioClient()
                self._audio.Init()
            elif self._motion_state == RobotState.LOW_LEVEL:
                logger.info(
                    "Starting client with real robot control, low-level (hand control) API mode..."
                )
                logger.info("Initializing low-level arms and hands IK solver...")
                self._arms_and_hands = ik.ik.ArmsAndHands(mock=mock)
        else:
            if self._motion_state == RobotState.HIGH_LEVEL:
                logger.info(
                    "Starting client in mock robot mode, high-level (locomotion) API mode..."
                )
            elif self._motion_state == RobotState.LOW_LEVEL:
                logger.info(
                    "Starting client in mock robot mode, low-level (hand control) API mode..."
                )
                logger.info("Initializing low-level arms and hands IK solver...")
                self._arms_and_hands = ik.ik.ArmsAndHands(mock=mock)

        self.head_rot = np.array([0, 0, 0, 1])

    def _set_state(self, new_state: RobotState):
        return
        # TODO:
        # if self.mock:
        #     return
        # try:
        #     # # Check the current state.
        #     # code, curr_state = self._motion_switcher.CheckMode()
        #     # if code != 0:
        #     #     logger.warning(f"Error setting state: {code}")
        #     #     return
        #     # curr_state_name = curr_state["name"]
        #     # if curr_state_name != new_state.value:
        #     if new_state == RobotState.HIGH_LEVEL:
        #         self._arms_and_hands.pause_movement_publisher()

        #         # self._motion_switcher.ReleaseMode()
        #         # self._motion_switcher.SelectMode(new_state.value)

        #     elif new_state == RobotState.LOW_LEVEL:
        #         self._arms_and_hands.resume_movement_publisher()

        #     self._motion_state = new_state
        # except Exception as e:
        #     logger.warning(f"Error setting state: {e}")
        #     return

    def act(self, action: str):
        """Handle discrete pre-programmed actions."""
        if self.mock:
            logger.info(f"Mock action: {action}")
            return
        if self._motion_state == RobotState.LOW_LEVEL:
            logger.warning(
                f"Cannot perform action in low-level mode: {action}. Restart client in high-level mode with --mode ai_sport"
            )
            return
        # self._set_state(RobotState.HIGH_LEVEL)
        try:
            if action == "stand":
                self._loco.HighStand()
            elif action == "stand_low":
                self._loco.LowStand()
            elif action == "stand_high":
                self._loco.HighStand()
            elif action == "sit":
                self._loco.Sit()
            elif action == "wave":
                self._loco.WaveHand()
            elif action == "wave_turn":
                self._loco.WaveHand(True)
            elif action == "shake_hand":
                self._loco.ShakeHand()
            elif action == "zero_torque":
                self._loco.ZeroTorque()
            elif action == "damp":
                self._loco.Damp()
            elif action == "squat2stand":
                self._loco.Squat2StandUp()
            elif action == "lie2stand":
                self._loco.Lie2StandUp()
            elif action == "stand2squat":
                self._loco.StandUp2Squat()
            else:
                logger.warning(f"Unknown action: {action}")
        except Exception as e:
            logger.warning(f"Error handling action: {e}")

    async def move_hands(self, movement: ik.ik.HandMovement):
        # self._set_state(RobotState.LOW_LEVEL)
        if self._motion_state == RobotState.HIGH_LEVEL:
            logger.warning(
                "Cannot move hands in high-level mode. Restart client in low-level mode with --mode basic_service"
            )
            return
        try:
            await self._arms_and_hands.move(movement, self.mock)
        except Exception as e:
            logger.warning(f"Error handling hand movement: {e}")

    def walk(self, long: float, lat: float, yaw: float):
        """Handle walking commands with speed clamping."""
        if self.mock:
            logger.info(f"Mock walk command: long={long}, lat={lat}, yaw={yaw}")
            return
        if self._motion_state == RobotState.LOW_LEVEL:
            logger.warning(
                "Cannot walk in low-level mode. Restart client in high-level mode with --mode ai_sport"
            )
            return
        # self._set_state(RobotState.HIGH_LEVEL)
        # Clamp speed values to the configured limits
        x_vel = max(min(long, FORWARD_SPEED), -FORWARD_SPEED)
        y_vel = max(min(lat, LATERAL_SPEED), -LATERAL_SPEED)
        yaw_vel = max(min(yaw, ROTATION_SPEED), -ROTATION_SPEED)

        # If any of these values are greater than zero, set the rgb to red to indicate the robot is moving.
        if x_vel > 0 or y_vel > 0 or yaw_vel > 0:
            self.rgb(255, 0, 0)
        else:
            self.rgb(0, 0, 0)

        self._loco.Move(x_vel, y_vel, yaw_vel)

    def rgb(self, r: int, g: int, b: int):
        """Set robot RGB"""
        # Clamp RGB values to 0-255
        r = max(0, min(r, 255))
        g = max(0, min(g, 255))
        b = max(0, min(b, 255))
        if self.mock:
            logger.info(f"Mock RGB command: r={r}, g={g}, b={b}")
            return
        if self._motion_state == RobotState.HIGH_LEVEL:
            self._audio.LedControl(r, g, b)

    def tts(self, text: str):
        """Play text to speech"""
        if self.mock:
            logger.info(f"Mock TTS command: {text}")
            return
        # self._audio.TtsMaker(text, 1) # TODO: This only support Chinese at the moment. `1` is the language code for English, but it isn't implemented by Unitree yet.

    async def get_sim_image(self):
        """Get a rendered perspective of the robot's simulated movements"""
        if self._motion_state == RobotState.HIGH_LEVEL:
            # Return an image that says the robot is in High Level mode and can't accept hand movements.
            image = Image.new("RGB", (512, 512), (0, 0, 0))
            d = datetime.datetime.now(tz=datetime.UTC)
            timestamp_str = d.isoformat(timespec="milliseconds")
            draw = ImageDraw.Draw(image)
            font = ImageFont.load_default()
            font.size = 14
            text = f"{timestamp_str}\nHigh Level Mode\nCannot accept hand movements"
            draw.text((5, 5), text, fill=(0, 255, 0), font=font)
            return image.tobytes()
        x, y, z, w = self.head_rot
        image = await self._arms_and_hands.render(x, y, z, w)
        # Add timestamp ISO with decimal seconds
        d = datetime.datetime.now(tz=datetime.UTC)
        timestamp_str = d.isoformat(timespec="milliseconds")
        draw = ImageDraw.Draw(image)
        font = ImageFont.load_default()
        font.size = 14
        text = f"{'[MOCK]' if self.mock else '[LIVE]'} {timestamp_str}"
        # Draw the text
        draw.text((5, 5), text, fill=(0, 255, 0), font=font)
        # Return the image as bytes
        return image.tobytes()


class RobotClient:
    def __init__(self, server_url: str, mode: RobotState, mock: bool = True):
        self.server_url = server_url
        self.ws = None
        self.client_id = None
        self.paired_with = None
        self.status = STATUS_DISCONNECTED
        self.running = True
        self.robot = Robot(mode=mode, mock=mock)

    async def connect(self):
        """Connect to the server and identify as a robot client"""
        try:
            logger.info(f"Connecting to {self.server_url}")
            self.ws = await websockets.connect(
                self.server_url, ping_timeout=60, ping_interval=10
            )

            # Identify as robot
            await self.ws.send(json.dumps({"type": "robot"}))
            logger.info("Connected and identified as robot client")

            return True
        except Exception:
            logger.exception("Connection failed")
            return False

    async def handle_messages(self):
        """Process incoming messages from the server"""
        try:
            while self.running and self.ws:
                try:
                    message = await self.ws.recv()
                    try:
                        data = json.loads(message)
                        await self.process_message(data)
                    except json.JSONDecodeError:
                        logger.warning(f"Received non-JSON message: {message}")
                except websockets.exceptions.ConnectionClosed as e:
                    logger.warning(f"Connection closed: {e}")
                    self.status = STATUS_DISCONNECTED
                    self.paired_with = None
                    break
        except Exception as e:
            logger.error(f"Error handling messages: {e}")

    async def process_message(self, data: dict):
        """Process different types of messages"""
        if data.get("type") == "status_update":
            self.handle_status_update(data)
        elif data.get("type") == "ping":
            await self.handle_ping(data)
        elif data.get("type") == "walk":
            self.robot.walk(data.get("long", 0), data.get("lat", 0), data.get("yaw", 0))
        elif data.get("type") in [
            "stand",
            "stand_low",
            "stand_high",
            "sit",
            "wave",
            "wave_turn",
            "shake_hand",
            "zero_torque",
            "damp",
            "squat2stand",
            "lie2stand",
            "stand2squat",
        ]:
            self.robot.act(data.get("type"))
        elif data.get("type") == "hand_movement":
            movement = ik.ik.HandMovement(data)
            await self.robot.move_hands(movement)
        else:
            logger.info(f"Received message: {data}")

    def handle_status_update(self, data: dict):
        """Handle status update messages from the server"""
        old_status = self.status
        self.status = data.get("status")
        # Always reset the movement to zero when the status changes.
        logger.info("Stopping robot movement")
        self.robot.walk(0, 0, 0)
        if self.status == STATUS_PAIRED:
            self.paired_with = data.get("paired_with", {})
            msg = f"Paired with {self.paired_with.get('type')} client ID: {self.paired_with.get('id')}"
            logger.info(msg)
            self.robot.rgb(0, 255, 0)  # Green LED for paired status
            self.robot.tts(msg)
        elif old_status == STATUS_PAIRED and self.status == STATUS_WAITING:
            logger.info(f"Unpairing: {data.get('message')}")
            self.paired_with = None
            self.robot.rgb(255, 255, 0)  # Yellow LED for waiting.
            self.robot.tts("Hasta la vista baby")
        elif self.status == STATUS_WAITING:
            if "client_id" in data:
                self.client_id = data.get("client_id")
            msg = f"Client ID: {self.client_id} Waiting for pair: {data.get('message')}"
            logger.info(msg)
            self.robot.rgb(255, 255, 0)  # Yellow LED for waiting.
            self.robot.tts("Waiting")
        elif self.status == STATUS_DISCONNECTED:
            logger.info(f"Disconnected: {data.get('message')}")
            self.robot.rgb(0, 0, 0)  # LED off when disconnected.
            self.robot.tts("I'll be back")

    async def handle_ping(self, data: dict):
        """Respond to ping messages for latency measurement"""
        # TODO: Add a nonce for RTT measurement.
        timestamp = data.get("timestamp")
        if timestamp:
            await self.ws.send(
                json.dumps({"type": "pong", "ping_timestamp": timestamp})
            )

    async def send_status(self):
        """Send status updates to the Spectacles client if paired"""
        try:
            while self.running:
                if self.ws and self.status == STATUS_PAIRED:
                    await self.ws.send(
                        json.dumps(
                            {
                                "type": "robot_status",
                                "timestamp": time.time(),
                                "battery": 85,  # TODO: DDS rt/lf/bmsstate
                                "position": [
                                    0,
                                    0,
                                    0,
                                ],  # TODO: c.f. https://support.unitree.com/home/en/G1_developer/odometer_service_interface
                                "orientation": [0, 0, 0, 1],
                            }
                        )
                    )
                await asyncio.sleep(1)
        except Exception as e:
            logger.error(f"Error sending status: {e}")

    async def send_sim_images(self):
        """Stream simulation images with adaptive framerate"""
        fps_target = 30  # Target FPS
        min_frame_time = 1.0 / fps_target
        actual_fps = fps_target

        # For tracking actual FPS
        fps_tracking_period = 5.0  # seconds
        frame_count = 0
        period_start = time.monotonic()

        try:
            while self.running:
                if self.ws and self.status == STATUS_PAIRED:
                    frame_start = time.monotonic()
                    try:
                        image_data = await self.robot.get_sim_image()
                        if image_data:
                            msg_bytes = (
                                struct.pack("!cI", b"s", len(image_data)) + image_data
                            )
                            await self.ws.send(msg_bytes)
                            frame_count += 1

                        # Track actual FPS
                        now = time.monotonic()
                        if now - period_start >= fps_tracking_period:
                            actual_fps = frame_count / (now - period_start)
                            logger.info(f"Image streaming actual FPS: {actual_fps:.1f}")
                            frame_count = 0
                            period_start = now

                        # Adaptive sleep based on processing time
                        elapsed = time.monotonic() - frame_start
                        sleep_time = max(0, min_frame_time - elapsed)
                        await asyncio.sleep(sleep_time)

                    except Exception as e:
                        logger.error(f"Error in image streaming: {e}")
                        await asyncio.sleep(1)  # Backoff on error
                else:
                    await asyncio.sleep(0.1)

        except asyncio.CancelledError:
            logger.info("Image streaming task cancelled")

    async def run(self):
        self.shutdown_event = asyncio.Event()
        connected = await self.connect()
        if connected:
            async with asyncio.TaskGroup() as tg:
                tg.create_task(self.handle_messages())
                tg.create_task(self.send_sim_images())
                tg.create_task(self.send_status())
                await self.shutdown_event.wait()
        else:
            logger.error("Failed to connect to the server")

    async def stop(self):
        """Stop the client gracefully"""
        self.running = False
        self.shutdown_event.set()
        if self.ws:
            try:
                await self.ws.send(json.dumps({"type": "unpair"}))
            except Exception:
                logger.exception("Error sending unpair message")
            await self.ws.close()
        logger.info("Robot client stopped")


async def main():
    parser = argparse.ArgumentParser(
        description="Unitree Robot Client for Spectacles Coordination"
    )
    parser.add_argument(
        "--server",
        default="wss://spectaclexr.com/ws",
        help="Coordination server WebSocket URL",
    )
    parser.add_argument(
        "--mode",
        action="store",
        choices=[RobotState.LOW_LEVEL.value, RobotState.HIGH_LEVEL.value],
        default=RobotState.LOW_LEVEL.value,
        help="Robot mode: low-level hand control (basic_service) or high-level locomotion (ai_sport)",
    )
    parser.add_argument(
        "--mock",
        action="store_true",
        default=False,
        help="Run in mock mode for testing purposes",
    )
    args = parser.parse_args()
    try:
        args.mode = RobotState(args.mode)
    except ValueError:
        logger.error(f"Invalid mode: {args.mode}. Use 'basic_service' or 'ai_sport'.")
        return
    client = RobotClient(args.server, mode=args.mode, mock=args.mock)
    loop = asyncio.get_running_loop()

    for sig in (signal.SIGINT, signal.SIGTERM):
        loop.add_signal_handler(
            sig, lambda s=sig: asyncio.create_task(shutdown(client))
        )

    await client.run()


async def shutdown(client):
    """Graceful shutdown"""
    logger.info("Shutting down...")
    await client.stop()


if __name__ == "__main__":
    asyncio.run(main())
