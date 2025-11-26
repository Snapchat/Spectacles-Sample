"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KindnessCounter = void 0;
var __selfType = requireType("./KindnessCounter");
function component(target) { target.getTypeName = function () { return __selfType; }; }
const supabase_snapcloud_1 = require("SupabaseClient.lspkg/supabase-snapcloud");
let KindnessCounter = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var KindnessCounter = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.supabaseProject = this.supabaseProject;
            this.allowIncrementFromLens = this.allowIncrementFromLens;
            this.totalText = this.totalText;
            this.startRoot = this.startRoot;
            this.endRoot = this.endRoot;
            this.balloonPrefabs = this.balloonPrefabs;
            this.balloonsParent = this.balloonsParent;
            this.maxOthers = this.maxOthers;
            this.missingConfigRoot = this.missingConfigRoot;
            this.client = null;
            this.inited = false;
            this.alreadyPledged = false;
        }
        __initialize() {
            super.__initialize();
            this.supabaseProject = this.supabaseProject;
            this.allowIncrementFromLens = this.allowIncrementFromLens;
            this.totalText = this.totalText;
            this.startRoot = this.startRoot;
            this.endRoot = this.endRoot;
            this.balloonPrefabs = this.balloonPrefabs;
            this.balloonsParent = this.balloonsParent;
            this.maxOthers = this.maxOthers;
            this.missingConfigRoot = this.missingConfigRoot;
            this.client = null;
            this.inited = false;
            this.alreadyPledged = false;
        }
        onAwake() {
            this.createEvent('OnStartEvent').bind(() => this.initFlow());
        }
        onDestroy() {
            try {
                this.client?.removeAllChannels?.();
            }
            catch (_) { }
        }
        // We call this from BalloonsManager when the user chooses a balloon
        async onBalloonSelected() {
            await this.ensureInit();
            if (this.alreadyPledged) {
                this.log('Already pledged in this session.');
                return;
            }
            const { error } = await this.client.rpc('pledge_and_total_once');
            if (error) {
                this.log('pledge_and_total_once error: ' + error.message);
                return;
            }
            const totalAll = await this.fetchAllTimeTotal();
            this.alreadyPledged = true;
            this.updateTotalText(totalAll);
            this.showEnd(totalAll);
        }
        // Determines whether the user has pledged before. Shows Start screen or End screen accordingly.
        async initFlow() {
            await this.ensureInit();
            if (!this.supabaseProject) {
                return;
            }
            // Check if user has already pledged
            try {
                const { data, error } = await this.client.rpc('has_pledged_ever');
                if (error) {
                    this.log('has_pledged_before error: ' + error.message);
                    // If unsure, default to start screen
                    this.showStart();
                    return;
                }
                const has = Boolean(data);
                this.alreadyPledged = has;
                if (has) {
                    // Jump to end screen and show current total
                    const totalAll = await this.fetchAllTimeTotal();
                    this.updateTotalText(totalAll);
                    this.alreadyPledged = true;
                    this.showEnd(totalAll);
                    this.log(`Already pledged → showing End. Total: ${totalAll}`);
                }
                else {
                    // Show start screen (balloons visible)
                    this.showStart();
                    this.log('No pledge yet → showing Start.');
                }
            }
            catch (e) {
                this.log('Startup check exception: ' + e);
                this.showStart();
            }
        }
        // Creates the Supabase client and signs the user in.
        async ensureInit() {
            if (this.inited)
                return;
            if (!this.supabaseProject) {
                this.log('ERROR: SupabaseProject not assigned.');
                // Show the missing config UI
                if (this.missingConfigRoot) {
                    this.missingConfigRoot.enabled = true;
                }
                // Hide the normal UI to avoid confusion
                if (this.startRoot)
                    this.startRoot.enabled = false;
                if (this.endRoot)
                    this.endRoot.enabled = false;
                // Prevent the script from doing anything else
                this.inited = true;
                return;
            }
            // Required module
            globalThis.supabaseModule = require('LensStudio:SupabaseModule');
            try {
                this.client = (0, supabase_snapcloud_1.createClient)(this.supabaseProject.url, this.supabaseProject.publicToken);
                this.log('Client created.');
                const { data, error } = await this.client.auth.signInWithIdToken({
                    provider: 'snapchat',
                    token: '',
                });
                if (error)
                    this.log('Auth error: ' + error.message);
                else
                    this.log('Auth OK: ' + (data?.user?.id || 'no-id'));
            }
            catch (e) {
                this.log('Init failure: ' + e);
                return;
            }
            this.inited = true;
        }
        // Displays the Start screen and hides the End screen.
        showStart() {
            if (this.startRoot) {
                this.startRoot.enabled = true;
            }
            if (this.endRoot) {
                this.endRoot.enabled = false;
            }
        }
        // Displays the End screen and spawns balloons
        showEnd(total) {
            if (this.startRoot) {
                this.startRoot.enabled = false;
            }
            if (this.endRoot) {
                this.endRoot.enabled = true;
            }
            const count = Math.min(this.maxOthers, Math.max(0, total));
            this.log(`Spawning ${count} balloons for total ${total}`);
            for (let i = 0; i < count; i++) {
                this.spawnRandomBalloon();
            }
        }
        // Instantiates one random balloon prefab in a random position
        spawnRandomBalloon() {
            if (!this.balloonsParent || !this.balloonPrefabs || this.balloonPrefabs.length === 0) {
                this.log('Spawn skipped: missing container or prefabs');
                return;
            }
            // Pick a random prefab
            const prefab = this.balloonPrefabs[Math.floor(Math.random() * this.balloonPrefabs.length)];
            const obj = prefab.instantiate(this.balloonsParent);
            if (!obj)
                return;
            // Randomize local position
            const tr = obj.getTransform();
            const x = this.randRange(-30, 30);
            const y = this.randRange(50, 100);
            const z = this.randRange(-50, 5);
            tr.setLocalPosition(new vec3(x, y, z));
        }
        // Returns a random number in the specified range
        randRange(min, max) {
            return min + Math.random() * (max - min);
        }
        // Updates the total pledge count displayed to the user
        updateTotalText(n) {
            if (!this.totalText)
                return;
            this.totalText.text = n.toLocaleString();
        }
        // Utility logger for debugging
        log(msg) {
            print('[KindnessCounter] ' + msg);
        }
        // Retrieves the global pledge count from Supabase
        async fetchAllTimeTotal() {
            try {
                const { data, error } = await this.client.rpc('get_kindness_total_all');
                if (error) {
                    this.log('get_kindness_total_all error: ' + error.message);
                    return 0;
                }
                return Number(data || 0);
            }
            catch (e) {
                this.log('get_kindness_total_all exception: ' + e);
                return 0;
            }
        }
    };
    __setFunctionName(_classThis, "KindnessCounter");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        KindnessCounter = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return KindnessCounter = _classThis;
})();
exports.KindnessCounter = KindnessCounter;
//# sourceMappingURL=KindnessCounter.js.map