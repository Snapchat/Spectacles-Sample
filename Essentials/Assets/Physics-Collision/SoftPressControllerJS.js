// Import required modules
const mix = require("SpectaclesInteractionKit.lspkg/Utils/animate").mix;
const clamp = require("SpectaclesInteractionKit.lspkg/Utils/mathUtils").clamp;

//@input SceneObject colliderObject {"hint":"The collider that will detect the soft press interaction"}
//@input SceneObject interactorObject {"hint":"The interactor object (e.g., finger tip)"}
//@input SceneObject closestPointMarker {"hint":"Optional: A SceneObject to visually mark the closest point on the line (for debugging)", "allowUndefined": true}
//@input SceneObject topVertex0 {"hint":"Top vertex 0 of the collider cube"}
//@input SceneObject topVertex1 {"hint":"Top vertex 1 of the collider cube"}
//@input SceneObject topVertex2 {"hint":"Top vertex 2 of the collider cube"}
//@input SceneObject topVertex3 {"hint":"Top vertex 3 of the collider cube"}
//@input SceneObject bottomVertex0 {"hint":"Bottom vertex 0 of the collider cube"}
//@input SceneObject bottomVertex1 {"hint":"Bottom vertex 1 of the collider cube"}
//@input SceneObject bottomVertex2 {"hint":"Bottom vertex 2 of the collider cube"}
//@input SceneObject bottomVertex3 {"hint":"Bottom vertex 3 of the collider cube"}
//@input float pressThreshold = 0.7 {"hint":"The threshold for triggering the press event (0 to 1)"}
//@input float resetDuration = 1.0 {"hint":"Time (in seconds) for the press value to smoothly reset to 0 after exit"}
//@input bool next = false {"hint":"Does the presentation switcher bring you to the next slide?"}

// Private variables
let collider;
let isInteracting = false;
let pressValue = 0;
let hasTriggeredEvent = false;
let isResetting = false;
let resetProgress = 0;
let localTop; // Top position in local space
let localBottom; // Bottom position in local space
let lastClosestPointLocal; // Store the last closest point in local space
let activeOverlapId = null; // Track the active overlap ID

function onAwake() {
  // Get the collider component
  collider = script.colliderObject.getComponent("Physics.ColliderComponent");

  // Bind the onStart event
  script.createEvent("OnStartEvent").bind(() => {
    onStart();
    print("OnStart event triggered");
  });

  // Bind the update event
  script.createEvent("UpdateEvent").bind(() => {
    update();
    print("Update event triggered");
  });

  // Calculate the top and bottom positions in local space by averaging the vertices
  const topPositions = [
    script.topVertex0.getTransform().getWorldPosition(),
    script.topVertex1.getTransform().getWorldPosition(),
    script.topVertex2.getTransform().getWorldPosition(),
    script.topVertex3.getTransform().getWorldPosition()
  ];
  const bottomPositions = [
    script.bottomVertex0.getTransform().getWorldPosition(),
    script.bottomVertex1.getTransform().getWorldPosition(),
    script.bottomVertex2.getTransform().getWorldPosition(),
    script.bottomVertex3.getTransform().getWorldPosition()
  ];

  // Average the top and bottom positions in world space
  const worldTop = topPositions.reduce((sum, pos) => sum.add(pos), vec3.zero()).scale(new vec3(0.25, 0.25, 0.25));
  const worldBottom = bottomPositions.reduce((sum, pos) => sum.add(pos), vec3.zero()).scale(new vec3(0.25, 0.25, 0.25));

  // Convert to local space of the collider
  const colliderTransform = script.colliderObject.getTransform();
  const inverseWorldTransform = colliderTransform.getInvertedWorldTransform();
  localTop = inverseWorldTransform.multiplyPoint(worldTop);
  localBottom = inverseWorldTransform.multiplyPoint(worldBottom);

  // Initialize press value and last closest point (in local space)
  pressValue = 0;
  lastClosestPointLocal = localTop;
}

function onStart() {
  // Setup overlap events for the collider
  collider.onOverlapEnter.add((e) => {
    const overlap = e.overlap;
    if (overlap.collider.getSceneObject() === script.interactorObject) {
      // Check if the interactor entered from the top
      if (isEnteringFromTop()) {
        print(`OverlapEnter(${overlap.id}): Interactor entered from the top. Starting soft press interaction.`);
        isInteracting = true;
        isResetting = false; // Stop any ongoing reset
        resetProgress = 0;
        activeOverlapId = overlap.id; // Store the overlap ID
      } else {
        print(`OverlapEnter(${overlap.id}): Interactor did not enter from the top. Ignoring.`);
      }
    }
  });

  collider.onOverlapStay.add((e) => {
    const overlap = e.overlap;
    if (
      overlap.collider.getSceneObject() === script.interactorObject &&
      isInteracting &&
      overlap.id === activeOverlapId
    ) {
      print(`OverlapStay(${overlap.id}): Processing soft press interaction.`);
      calculatePressValue();
    }
  });

  collider.onOverlapExit.add((e) => {
    const overlap = e.overlap;
    if (overlap.collider.getSceneObject() === script.interactorObject && overlap.id === activeOverlapId) {
      print(`OverlapExit(${overlap.id}): Interactor exited the collider. Starting smooth reset of press value.`);
      isInteracting = false;
      isResetting = true;
      resetProgress = 0;
      activeOverlapId = null; // Clear the overlap ID
    }
  });
}

// Check if the interactor is entering from the top (local up direction of the collider)
function isEnteringFromTop() {
  const interactorPos = script.interactorObject.getTransform().getWorldPosition();
  const colliderPos = script.colliderObject.getTransform().getWorldPosition();
  const colliderUp = script.colliderObject.getTransform().up; // Local up direction in world space

  // Vector from collider center to interactor
  const directionToInteractor = interactorPos.sub(colliderPos).normalize();

  // Dot product between collider's up direction and the direction to the interactor
  const dot = directionToInteractor.dot(colliderUp);

  // If dot product is positive and close to 1, the interactor is above the collider
  return dot > 0.5; // Adjust threshold as needed
}

// Calculate the press value (0 to 1) based on the closest point's position
function calculatePressValue() {
  const interactorPos = script.interactorObject.getTransform().getWorldPosition();

  // Convert interactor position to local space of the collider
  const colliderTransform = script.colliderObject.getTransform();
  const inverseWorldTransform = colliderTransform.getInvertedWorldTransform();
  const interactorPosLocal = inverseWorldTransform.multiplyPoint(interactorPos);

  // Find the closest point on the collider to the interactor (in world space)
  // Since closestPoint is not available, we'll use the line from top to bottom instead
  const worldTop = colliderTransform.getWorldTransform().multiplyPoint(localTop);
  const worldBottom = colliderTransform.getWorldTransform().multiplyPoint(localBottom);

  // Calculate the direction from top to bottom
  const topToBottom = worldBottom.sub(worldTop);
  const topToInteractor = interactorPos.sub(worldTop);

  // Project the interactor position onto the line
  const projectionRatio = clamp(topToInteractor.dot(topToBottom) / topToBottom.dot(topToBottom), 0, 1);

  // Calculate the closest point on the line
  const closestPointWorld = worldTop.add(
    topToBottom.scale(new vec3(projectionRatio, projectionRatio, projectionRatio))
  );

  // Convert the closest point to local space
  const closestPointLocal = inverseWorldTransform.multiplyPoint(closestPointWorld);
  lastClosestPointLocal = closestPointLocal; // Store for reset

  // Project the closest point onto the line from top to bottom (in local space)
  const localTopToBottom = localBottom.sub(localTop);
  const topToClosest = closestPointLocal.sub(localTop);
  const projectionLength = topToClosest.dot(localTopToBottom.normalize());
  const totalLength = localTopToBottom.length;

  // Calculate the press value (0 at top, 1 at bottom)
  const newPressValue = clamp(projectionLength / totalLength, 0, 1);

  // Update press value and check for event trigger
  pressValue = newPressValue;
  print(`Press value: ${pressValue}`);

  // Optionally move the marker to the closest point (in world space, for visualization)
  if (script.closestPointMarker) {
    script.closestPointMarker.getTransform().setWorldPosition(closestPointWorld);
  }

  // Trigger event if press value exceeds threshold and hasn't been triggered yet
  if (pressValue >= script.pressThreshold && !hasTriggeredEvent) {
    onPressThresholdReached();
    hasTriggeredEvent = true;
  }

  // Reset the event trigger if the press value returns to 0 (top position)
  if (pressValue <= 0 && hasTriggeredEvent) {
    print("Press value reset to 0. Event can trigger again on next press.");
    hasTriggeredEvent = false;
  }
}

// Smoothly reset the press value to 0
function smoothReset() {
  if (!isResetting) return;

  // Increment reset progress based on time
  resetProgress += getDeltaTime() / script.resetDuration;
  resetProgress = clamp(resetProgress, 0, 1);

  // Interpolate the closest point from its last position to the top (in local space)
  const interpolatedPointLocal = mix(lastClosestPointLocal, localTop, resetProgress);

  // Update press value based on the interpolated point
  const topToBottom = localBottom.sub(localTop);
  const topToCurrent = interpolatedPointLocal.sub(localTop);
  const projectionLength = topToCurrent.dot(topToBottom.normalize());
  const totalLength = topToBottom.length;
  pressValue = clamp(projectionLength / totalLength, 0, 1);

  // Optionally move the marker to the interpolated point (convert back to world space for visualization)
  if (script.closestPointMarker) {
    const colliderTransform = script.colliderObject.getTransform();
    const interpolatedPointWorld = colliderTransform.getWorldTransform().multiplyPoint(interpolatedPointLocal);
    script.closestPointMarker.getTransform().setWorldPosition(interpolatedPointWorld);
  }

  // Reset the event trigger if the press value returns to 0
  if (pressValue <= 0 && hasTriggeredEvent) {
    print("Press value reset to 0 during smooth reset. Event can trigger again on next press.");
    hasTriggeredEvent = false;
  }

  // Stop resetting when fully reset
  if (resetProgress >= 1) {
    isResetting = false;
    resetProgress = 0;
    pressValue = 0;
    lastClosestPointLocal = localTop;
    print("Smooth reset complete.");
  }
}

// Event triggered when the press threshold is reached
function onPressThresholdReached() {
  print(`Press threshold of ${script.pressThreshold} reached! Triggering event.`);
  if (script.next) {
    navigateToNext();
  } else {
    navigateToPrevious();
  }
}

// Navigate to the next slide and synchronize across all platforms
function navigateToNext() {
  print("PRESSED FOR NEXT ACTION - Going to next slide");
}

// Navigate to the previous slide and synchronize across all platforms
function navigateToPrevious() {
  print("PRESSED FOR PREVIOUS ACTION - Going to previous slide");
}

function update() {
  if (isInteracting) {
    calculatePressValue();
  }
  if (isResetting) {
    smoothReset();
  }
}

// Start the script
onAwake();
