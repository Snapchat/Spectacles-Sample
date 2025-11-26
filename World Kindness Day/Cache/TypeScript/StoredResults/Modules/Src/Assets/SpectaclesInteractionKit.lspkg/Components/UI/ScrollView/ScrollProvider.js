"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScrollProvider = void 0;
const animate_1 = require("../../../Utils/animate");
const Event_1 = require("../../../Utils/Event");
const mathUtils_1 = require("../../../Utils/mathUtils");
const MovingAverageFilter_1 = require("../../../Utils/MovingAverageFilter");
const SyncKitBridge_1 = require("../../../Utils/SyncKitBridge");
const BufferedBoundariesProvider_1 = require("./boundariesProvider/BufferedBoundariesProvider");
const VELOCITY_WINDOW_SIZE = 10;
const DECELERATE_TIME = 2.0;
// The minimum speed to keep moving the content during update frames.
const DECELERATE_MIN_SPEED = 1;
const ELASTIC_TIME = 0.4;
// The minimum distance from content edge to keep moving the content during update frames.
const ELASTIC_MIN_DISTANCE = 0.05;
const SCROLL_VIEW_VALUE_KEY = "ScrollViewValue";
const SCROLL_VIEW_INERTIA_KEY = "ScrollViewInertia";
const SCROLL_VIEW_CONNECTION_KEY = "ScrollViewConnection";
/**
 * Describes the scrolling logic between the content and the container
 */
class ScrollProvider {
    constructor(config) {
        this.config = config;
        this.onScrollUpdateEvent = new Event_1.default();
        this.onScrollUpdate = this.onScrollUpdateEvent.publicApi();
        this.onSnapUpdateEvent = new Event_1.default();
        this.onSnapUpdate = this.onSnapUpdateEvent.publicApi();
        this.onReadyEvent = new Event_1.default();
        this.onReady = this.onReadyEvent.publicApi();
        this.scrollArea = this.config.scrollArea;
        this.scrollView = this.config.scrollView;
        this.cancelSet = new animate_1.CancelSet();
        this.isXOverflow = false;
        this.isYOverflow = false;
        this.dragVelocity = vec2.zero();
        this.inertiaVelocity = vec2.zero();
        this.dragVelocityFilter = new MovingAverageFilter_1.MovingAverageFilter(VELOCITY_WINDOW_SIZE, vec2.zero, mathUtils_1.averageVec2);
        this.decelerateTime = DECELERATE_TIME;
        this.decelerateMinSpeed = DECELERATE_MIN_SPEED;
        this.elasticTime = ELASTIC_TIME;
        this.elasticMinDistance = ELASTIC_MIN_DISTANCE;
        this._contentLength = 0;
        this.contentOrigin = vec2.zero();
        this.isGrabbed = false;
        this._isManual = false;
        // Only defined if SyncKit is present within the lens project.
        this.syncKitBridge = SyncKitBridge_1.SyncKitBridge.getInstance();
        this.syncEntity = this.config.scrollView ? this.syncKitBridge.createSyncEntity(this.scrollView) : null;
        this.connectionId = null;
        this._enableScrollInertia = config.enableScrollInertia;
        this._scrollLimit = config.scrollLimit;
        this.enableScrollLimit = config.enableScrollLimit;
        this.onReady.add(() => {
            // Don't start updating until the content is ready, as the content is required for the update logic.
            this.config.updateEvent.bind((_event) => {
                this.update();
            });
            if (this.syncEntity !== null) {
                this.syncEntity.notifyOnReady(this.setupConnectionCallbacks.bind(this));
            }
        });
    }
    /**
     * @returns if this class is ready to be used, which means
     * that content is set
     */
    get isReady() {
        return this.content !== undefined;
    }
    /**
     * @returns if the ScrollView is being manually controlled by some component beyond ScrollView (e.g. ScrollBar)
     */
    get isManual() {
        return this._isManual;
    }
    /**
     * Sets if the ScrollView is being manually controlled by some component beyond ScrollView (e.g. ScrollBar)
     * @param isManual - true if the ScrollView is being manually controlled
     */
    set isManual(isManual) {
        this._isManual = isManual;
        if (isManual) {
            this.inertiaVelocity = vec2.zero();
        }
    }
    /**
     * @returns if the ScrollView will continue scrolling on release
     */
    get enableScrollInertia() {
        return this._enableScrollInertia;
    }
    /**
     * Toggles if the ScrollView should continue scrolling on release
     */
    set enableScrollInertia(enableScrollInertia) {
        this._enableScrollInertia = enableScrollInertia;
    }
    /**
     * @returns what amount of the scroll area should always be occupied
     */
    get scrollLimit() {
        return this._scrollLimit;
    }
    /**
     * Sets the amount of the scroll area should always be occupied
     */
    set scrollLimit(limit) {
        this._scrollLimit = limit;
    }
    /**
     * @returns the content position in local space
     */
    get contentPosition() {
        return this.content.position;
    }
    /**
     * Sets the position of the content in local space
     */
    set contentPosition(position) {
        this.content.position = position;
        this.updateSyncStore();
        this.onScrollUpdateEvent.invoke({
            contentPosition: new vec2(this.content.position.x, this.content.position.y)
        });
    }
    /**
     * @returns the content length along the Y-axis
     */
    get contentLength() {
        return this._contentLength;
    }
    /**
     * Sets the true length of the content in the case of pooling / other non-default use cases
     */
    set contentLength(length) {
        this._contentLength = length;
    }
    /**
     * Resets the content origin for the purpose of calculating scrollPercentage.
     * Assumes that the ScrollView is currently at the top of content in the pooling use case.
     */
    resetContentOrigin() {
        const originOffset = this.getOffsetToEdge({ x: -1, y: 1, type: "Content" });
        this.contentOrigin = new vec2(this.contentPosition.x + originOffset.x, this.contentPosition.y + originOffset.y);
    }
    /**
     * Resets the inertia velocity in the case that the developer wants to stop physics upon certain events.
     */
    resetInertiaVelocity() {
        this.inertiaVelocity = vec2.zero();
    }
    get overflow() {
        const scrollAreaSize = this.convertLocalUnitsToParentUnits(this.scrollArea.size);
        const scrollViewHeight = scrollAreaSize.y;
        return this.contentLength - scrollViewHeight;
    }
    get scrollPercentage() {
        const scrollPercentage = MathUtils.clamp(-this.contentOrigin.y + this.contentPosition.y, 0, this.overflow) / this.overflow;
        return scrollPercentage;
    }
    onGrabStart(_event) {
        this.dragVelocityFilter.clear();
        this.isGrabbed = true;
        this.dragVelocity = vec2.zero();
        this.updateSyncStore();
    }
    onGrabEnd(_event) {
        this.isGrabbed = false;
        this.updateInertiaVelocity();
        this.dragVelocity = vec2.zero();
    }
    /**
     * Sets scroll content. Should be called only one time to initialize the content
     * and binds to onStartEvent.
     * @param content - defines content boundaries
     */
    setContent(content) {
        if (this.content !== undefined) {
            throw new Error("Content is already initialized in ScrollProvider.");
        }
        this.content = content;
        this.contentScrollLimit = new BufferedBoundariesProvider_1.BufferedBoundariesProvider(this.content, Rect.create(0, 0, 0, 0));
        this.recomputeBoundaries();
        // Sometimes this will be called after the user instantiates the ScrollView and sets the contentLength, so we ensure that prior values are respected.
        if (this.contentLength === 0) {
            this.contentLength = this.convertLocalUnitsToParentUnits(this.content.size).y;
        }
        this.onReadyEvent.invoke();
    }
    /**
     * Recomputes content and scroll area boundaries
     */
    recomputeBoundaries() {
        this.content.recomputeStartingBoundaries();
        this.scrollArea.recomputeStartingBoundaries();
        const scrollAreaSize = this.scrollArea.boundaries.getSize();
        const invertedLimit = 1.0 - this.scrollLimit;
        this.contentScrollLimit.buffer = Rect.create(invertedLimit * scrollAreaSize.x, invertedLimit * scrollAreaSize.x, invertedLimit * scrollAreaSize.y, invertedLimit * scrollAreaSize.y);
        this.isYOverflow = this.scrollArea.size.y < this.content.size.y;
        this.isXOverflow = this.scrollArea.size.x < this.content.size.x;
    }
    /**
     * Scrolls content according to a drag vector, along the enabled axis
     * @param dragVector - 2D vector to move the content
     */
    scrollBy(dragVector) {
        if (this.isGrabbed && getDeltaTime() === 0) {
            return;
        }
        const deltaX = this.scrollView.enableHorizontalScroll && this.isXOverflow ? dragVector.x : 0;
        const deltaY = this.scrollView.enableVerticalScroll && this.isYOverflow ? dragVector.y : 0;
        this.content.position = this.content.position.add(new vec3(deltaX, deltaY, 0));
        if (!this.isManual) {
            if (this.enableScrollLimit && this.isEdgeInsideScrollArea("ScrollLimit")) {
                this.limitToEdgeInstantly("ScrollLimit");
                this.dragVelocity = vec2.zero();
            }
            else if (this.isGrabbed) {
                const rawVelocity = new vec2(deltaX, deltaY).uniformScale(1 / getDeltaTime());
                this.dragVelocity = this.dragVelocityFilter.filter(rawVelocity, getTime());
                // If the filtered drag velocity is not the same direction as the current frame's delta, negate the delta to avoid hooking.
                if (Math.sign(this.dragVelocity.x) !== Math.sign(deltaX)) {
                    this.content.position = this.content.position.add(new vec3(-deltaX, 0, 0));
                }
                if (Math.sign(this.dragVelocity.y) !== Math.sign(deltaY)) {
                    this.content.position = this.content.position.add(new vec3(0, -deltaY, 0));
                }
            }
        }
        this.updateSyncStore();
        this.onScrollUpdateEvent.invoke({
            contentPosition: new vec2(this.content.position.x, this.content.position.y)
        });
    }
    /**
     * Snaps content to the selected edges
     * @param selectedEdges - Struct that describes the selected edge as an {@link EdgeSelector}
     */
    snapToEdges(selectedEdges) {
        this.content.position = this.content.position.add(this.getOffsetToEdge(selectedEdges));
    }
    /**
     * Checks if both inputted content edges are fully visible in the ScrollArea.
     * @param xEdge - 0 if not checking any x-axis edge, 1 for right edge, -1 for left edge.
     * @param yEdge - 0 if not checking any y-axis edge, 1 for top edge, -1 for bottom edge.
     */
    checkContentEdgeFullyVisible(xEdge, yEdge) {
        let visible = true;
        const contentOffset = this.contentOffset;
        if (xEdge !== 0) {
            if (xEdge === 1) {
                visible = visible && contentOffset.right >= 0;
            }
            else if (yEdge === -1) {
                visible = visible && contentOffset.left <= 0;
            }
        }
        if (yEdge !== 0) {
            if (yEdge === 1) {
                visible = visible && contentOffset.top >= 0;
            }
            else if (yEdge === -1) {
                visible = visible && contentOffset.bottom <= 0;
            }
        }
        return visible;
    }
    offsetBetween(a, b) {
        return Rect.create(a.left - b.left, a.right - b.right, a.bottom - b.bottom, a.top - b.top);
    }
    get contentOffset() {
        return this.offsetBetween(this.scrollArea.boundaries, this.content.boundaries);
    }
    get scrollLimitOffset() {
        return this.offsetBetween(this.scrollArea.boundaries, this.contentScrollLimit.boundaries);
    }
    // Simulates physics (velocity upon release, friction, elasticity when past edge) when the user is not grabbing the ScrollView.
    update() {
        if (this.isManual || this.isGrabbed || getDeltaTime() === 0) {
            return;
        }
        if (this.syncEntity !== null) {
            const isRecentConnection = this.connectionId === this.syncKitBridge.sessionController.getLocalConnectionId();
            // If the local user is not the last user to interact with the ScrollView, do not simulate physics.
            if (!isRecentConnection) {
                return;
            }
        }
        const initialEdgeSelector = this.selectEdgesInsideScrollArea("Content");
        if (this.inertiaVelocity.equal(vec2.zero()) && initialEdgeSelector.x === 0 && initialEdgeSelector.y === 0) {
            return;
        }
        const deltaTime = getDeltaTime();
        let currentPosition = this.content.position;
        let currentVelocity = this.inertiaVelocity;
        // Apply friction to decelerate the contents post-interaction.
        const frictionResults = this.applyFriction(currentPosition, currentVelocity, this.decelerateTime, deltaTime);
        currentPosition = frictionResults[0];
        currentVelocity = frictionResults[1];
        this.content.position = currentPosition;
        // Ensure that the content does not exceed the scroll limit boundaries, zeroing out the velocity if reaching the limit.
        if (this.enableScrollLimit && this.isEdgeInsideScrollArea("ScrollLimit")) {
            this.limitToEdgeInstantly("ScrollLimit");
            currentPosition = this.content.position;
            currentVelocity = vec2.zero();
        }
        // Apply elasticity to return the contents within the boundaries.
        const elasticityResults = this.applyElasticity(currentPosition, currentVelocity, this.elasticTime, deltaTime);
        currentPosition = elasticityResults[0];
        currentVelocity = elasticityResults[1];
        this.content.position = currentPosition;
        // If the content is within the ScrollArea boundaries and has a low enough velocity, stop moving the contents to reduce update cost.
        const currentEdgeSelector = this.selectEdgesInsideScrollArea("Content");
        if (currentEdgeSelector.x === 0 && Math.abs(this.inertiaVelocity.x) < this.decelerateMinSpeed) {
            currentVelocity.x = 0;
        }
        if (currentEdgeSelector.y === 0 && Math.abs(this.inertiaVelocity.y) < this.decelerateMinSpeed) {
            currentVelocity.y = 0;
        }
        this.inertiaVelocity = currentVelocity;
        this.updateSyncStore();
        this.onScrollUpdateEvent.invoke({
            contentPosition: new vec2(this.content.position.x, this.content.position.y)
        });
    }
    /**
     * If there is a edge of the given type inside the scroll area, instantly snap to the edge.
     * @param edgeType The type of edge to snap to.
     */
    limitToEdgeInstantly(edgeType) {
        const snapEdges = this.selectEdgesInsideScrollArea(edgeType);
        const targetPositionOffset = this.getOffsetToEdge(snapEdges);
        this.content.position = this.content.position.add(targetPositionOffset);
    }
    /**
     * Returns true if any edge of the given type is inside the scroll region, as long as the content is
     * large enough in that dimension to be scrollable.
     * @param edgeType the type of edge to check for
     */
    isEdgeInsideScrollArea(edgeType) {
        const edgesInsideScrollArea = this.selectEdgesInsideScrollArea(edgeType);
        return (this.isXOverflow && edgesInsideScrollArea.x !== 0) || (this.isYOverflow && edgesInsideScrollArea.y !== 0);
    }
    selectEdgesInsideScrollArea(edgeType) {
        const snapEdges = { x: 0, y: 0, type: edgeType };
        const offset = edgeType === "Content" ? this.contentOffset : this.scrollLimitOffset;
        /**
         * only try to snap if there is an overflow in the x dimension
         */
        if (this.isXOverflow) {
            if (offset.left < 0) {
                /*
                 * if left border inside the scroll area,
                 * snap to left side
                 */
                snapEdges.x = -1;
            }
            else if (offset.right > 0) {
                /*
                 * if right border inside the scroll area,
                 * snap to right side
                 */
                snapEdges.x = 1;
            }
        }
        /**
         * only try to snap if there is an overflow in the y dimension
         */
        if (this.isYOverflow) {
            if (offset.top > 0) {
                /*
                 * if top border inside the scroll area,
                 * snap to top side
                 */
                snapEdges.y = 1;
            }
            else if (offset.bottom < 0) {
                /*
                 * if bottom border inside the scroll area,
                 * snap to bottom side
                 */
                snapEdges.y = -1;
            }
        }
        return snapEdges;
    }
    getOffsetToEdge(selectedEdges) {
        const offset = selectedEdges.type === "Content" ? this.contentOffset : this.scrollLimitOffset;
        const targetPositionOffset = vec2.zero();
        if (selectedEdges.x === -1) {
            targetPositionOffset.x = offset.left;
        }
        else if (selectedEdges.x === 1) {
            targetPositionOffset.x = offset.right;
        }
        if (selectedEdges.y === 1) {
            targetPositionOffset.y = offset.top;
        }
        else if (selectedEdges.y === -1) {
            targetPositionOffset.y = offset.bottom;
        }
        const worldUnitOffset = this.convertLocalUnitsToParentUnits(targetPositionOffset);
        return new vec3(worldUnitOffset.x, worldUnitOffset.y, 0);
    }
    updateInertiaVelocity() {
        const newInertiaVelocity = vec2.zero();
        if (Math.sign(this.dragVelocity.x) === Math.sign(this.inertiaVelocity.x)) {
            newInertiaVelocity.x = this.dragVelocity.x + this.inertiaVelocity.x;
        }
        else {
            newInertiaVelocity.x = this.dragVelocity.x;
        }
        if (Math.sign(this.dragVelocity.y) === Math.sign(this.inertiaVelocity.y)) {
            newInertiaVelocity.y = this.dragVelocity.y + this.inertiaVelocity.y;
        }
        else {
            newInertiaVelocity.y = this.dragVelocity.y;
        }
        this.inertiaVelocity = newInertiaVelocity;
        this.updateSyncStore();
    }
    applyFriction(position, velocity, decelerateTime, deltaTime) {
        const edgeSelector = this.selectEdgesInsideScrollArea("Content");
        // If the content is within the X-axis bounds, move the contents along the X-axis and apply friction.
        if (this.scrollView.enableHorizontalScroll && edgeSelector.x === 0) {
            const smoothResults = (0, mathUtils_1.smoothSlide)(position.x, velocity.x, decelerateTime, deltaTime);
            position.x = smoothResults[0];
            velocity.x = smoothResults[1];
        }
        // If the content is within the Y-axis bounds, move the contents along the Y-axis and apply friction.
        if (this.scrollView.enableVerticalScroll && edgeSelector.y === 0) {
            const smoothResults = (0, mathUtils_1.smoothSlide)(position.y, velocity.y, decelerateTime, deltaTime);
            position.y = smoothResults[0];
            velocity.y = smoothResults[1];
        }
        return [position, velocity];
    }
    applyElasticity(position, velocity, elasticTime, deltaTime) {
        const edgeSelector = this.selectEdgesInsideScrollArea("Content");
        const contentOffset = this.getOffsetToEdge(edgeSelector);
        // If the content is past the X-axis bounds, return the content closer to the boundary.
        if (this.scrollView.enableHorizontalScroll && edgeSelector.x !== 0) {
            const contentLimitX = position.x + contentOffset.x;
            const smoothResults = (0, mathUtils_1.smoothDamp)(position.x, contentLimitX, velocity.x, elasticTime, deltaTime);
            position.x = smoothResults[0];
            velocity.x = smoothResults[1];
            // If the content is close enough to the bounds, place the content exactly on the boundary to reduce update cost.
            if (Math.abs(position.x - contentLimitX) < this.elasticMinDistance) {
                position.x = contentLimitX;
                velocity.x = 0;
            }
        }
        // If the content is past the Y-axis bounds, return the content closer to the boundary.
        if (this.scrollView.enableVerticalScroll && edgeSelector.y !== 0) {
            const contentLimitY = position.y + contentOffset.y;
            const smoothResults = (0, mathUtils_1.smoothDamp)(position.y, contentLimitY, velocity.y, elasticTime, deltaTime);
            position.y = smoothResults[0];
            velocity.y = smoothResults[1];
            // If the content is close enough to the bounds, place the content exactly on the boundary to reduce update cost.
            if (Math.abs(position.y - contentLimitY) < this.elasticMinDistance) {
                position.y = contentLimitY;
                velocity.y = 0;
            }
        }
        return [position, velocity];
    }
    /**
     * Converts the offset (normalized -1 to 1) to local units relative to the ScrollView canvas.
     */
    convertLocalOffsetToParentOffset(offset) {
        const bottomLeftCorner = new vec2(offset.left, offset.bottom);
        const topRightCorner = new vec2(offset.right, offset.top);
        const bottomLeftOffsetWorld = this.convertLocalUnitsToParentUnits(bottomLeftCorner);
        const topRightOffsetWorld = this.convertLocalUnitsToParentUnits(topRightCorner);
        return Rect.create(bottomLeftOffsetWorld.x, topRightOffsetWorld.x, bottomLeftOffsetWorld.y, topRightOffsetWorld.y);
    }
    /**
     * Converts local units (normalized -1 to 1) to world units relative to the ScrollView canvas.
     */
    convertLocalUnitsToWorldUnits(localUnits) {
        const origin = this.config.screenTransform.localPointToWorldPoint(vec2.zero());
        const invertQuat = this.config.screenTransform.getSceneObject().getTransform().getWorldRotation().invert();
        const worldUnits = invertQuat.multiplyVec3(this.config.screenTransform.localPointToWorldPoint(localUnits).sub(origin));
        return new vec2(worldUnits.x, worldUnits.y);
    }
    /**
     * Converts local units (-1 to 1) to parent units relative to the ScrollView canvas.
     */
    convertLocalUnitsToParentUnits(localUnits) {
        const worldUnits = this.convertLocalUnitsToWorldUnits(localUnits);
        const worldScale = this.config.screenTransform.getTransform().getWorldScale();
        return new vec2(worldUnits.x / worldScale.x, worldUnits.y / worldScale.y);
    }
    /**
     * Resync the ScrollView to the state contained in the datastore.
     */
    resyncToStore() {
        if (this.syncEntity !== null && this.syncEntity.isSetupFinished) {
            this.content.position = this.syncEntity.currentStore.getVec3(SCROLL_VIEW_VALUE_KEY);
            this.onScrollUpdateEvent.invoke({
                contentPosition: new vec2(this.content.position.x, this.content.position.y)
            });
            this.inertiaVelocity = this.syncEntity.currentStore.getVec2(SCROLL_VIEW_INERTIA_KEY);
            this.connectionId = this.syncEntity.currentStore.getString(SCROLL_VIEW_CONNECTION_KEY);
        }
    }
    setupConnectionCallbacks() {
        if (this.syncEntity.currentStore.getAllKeys().find((key) => {
            return key === SCROLL_VIEW_VALUE_KEY;
        })) {
            // Wait until the onStart event to position the content according to the stored position.
            this.config.scrollView.createEvent("OnStartEvent").bind(() => {
                this.content.position = this.syncEntity.currentStore.getVec3(SCROLL_VIEW_VALUE_KEY);
            });
            this.onScrollUpdateEvent.invoke({
                contentPosition: new vec2(this.content.position.x, this.content.position.y)
            });
        }
        else {
            this.syncEntity.currentStore.putVec3(SCROLL_VIEW_VALUE_KEY, this.contentPosition);
        }
        this.syncEntity.storeCallbacks.onStoreUpdated.add(this.processStoreUpdate.bind(this));
    }
    processStoreUpdate(_session, store, key, info) {
        const connectionId = info.updaterInfo.connectionId;
        const updatedByLocal = connectionId === this.syncKitBridge.sessionController.getLocalConnectionId();
        if (updatedByLocal) {
            return;
        }
        if (key === SCROLL_VIEW_VALUE_KEY) {
            this.content.position = store.getVec3(SCROLL_VIEW_VALUE_KEY);
            this.onScrollUpdateEvent.invoke({
                contentPosition: new vec2(this.content.position.x, this.content.position.y)
            });
        }
        else if (key === SCROLL_VIEW_INERTIA_KEY) {
            this.inertiaVelocity = store.getVec2(SCROLL_VIEW_INERTIA_KEY);
        }
        else if (key === SCROLL_VIEW_CONNECTION_KEY) {
            this.connectionId = store.getString(SCROLL_VIEW_CONNECTION_KEY);
        }
    }
    updateSyncStore() {
        if (this.syncEntity !== null && this.syncEntity.isSetupFinished) {
            this.syncEntity.currentStore.putVec3(SCROLL_VIEW_VALUE_KEY, this.contentPosition);
            this.syncEntity.currentStore.putVec2(SCROLL_VIEW_INERTIA_KEY, this.inertiaVelocity);
            this.connectionId = this.syncKitBridge.sessionController.getLocalConnectionId();
            this.syncEntity.currentStore.putString(SCROLL_VIEW_CONNECTION_KEY, this.connectionId);
        }
    }
}
exports.ScrollProvider = ScrollProvider;
//# sourceMappingURL=ScrollProvider.js.map