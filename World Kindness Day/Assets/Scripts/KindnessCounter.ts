import { createClient } from 'SupabaseClient.lspkg/supabase-snapcloud'

@component
export class KindnessCounter extends BaseScriptComponent {

  @input
  @hint("SupabaseProject asset from Asset Browser (created via Supabase Plugin)")
  @allowUndefined 
  public supabaseProject!: SupabaseProject;

  @input allowIncrementFromLens: boolean = true;

  @input totalText?: Text;

  @input startRoot?: SceneObject;
  @input endRoot?: SceneObject;

  @input balloonPrefabs: ObjectPrefab[];
  @input balloonsParent?: SceneObject;
  @input maxOthers: number = 20;

  @input missingConfigRoot?: SceneObject;

  private client: any = null;
  private inited = false;
  private alreadyPledged = false;

  onAwake() {
    this.createEvent('OnStartEvent').bind(() => this.initFlow());
  }

  onDestroy() {
    try { this.client?.removeAllChannels?.(); } catch (_) { }
  }

  // We call this from BalloonsManager when the user chooses a balloon
  public async onBalloonSelected() {
    await this.ensureInit();
    if (this.alreadyPledged) {
      this.log('Already pledged in this session.');
      return;
    }

    const { error } = await this.client.rpc('pledge_and_total_once');
    if (error) { this.log('pledge_and_total_once error: ' + error.message); return; }

    const totalAll = await this.fetchAllTimeTotal();
    this.alreadyPledged = true;
    this.updateTotalText(totalAll);
    this.showEnd(totalAll);
  }

  // Determines whether the user has pledged before. Shows Start screen or End screen accordingly.
  private async initFlow() {
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
      } else {
        // Show start screen (balloons visible)
        this.showStart();
        this.log('No pledge yet → showing Start.');
      }
    } catch (e) {
      this.log('Startup check exception: ' + e);
      this.showStart();
    }
  }

  // Creates the Supabase client and signs the user in.
  private async ensureInit() {
    if (this.inited) return;

    if (!this.supabaseProject) {
      this.log('ERROR: SupabaseProject not assigned.');

      // Show the missing config UI
      if (this.missingConfigRoot) {
        this.missingConfigRoot.enabled = true;
      }

      // Hide the normal UI to avoid confusion
      if (this.startRoot) this.startRoot.enabled = false;
      if (this.endRoot) this.endRoot.enabled = false;

      // Prevent the script from doing anything else
      this.inited = true;
      return;
    }

    // Required module
    globalThis.supabaseModule = require('LensStudio:SupabaseModule');

    try {
      this.client = createClient(this.supabaseProject.url, this.supabaseProject.publicToken);
      this.log('Client created.');

      const { data, error } = await this.client.auth.signInWithIdToken({
        provider: 'snapchat',
        token: '',
      });
      if (error) this.log('Auth error: ' + error.message);
      else this.log('Auth OK: ' + (data?.user?.id || 'no-id'));
    } catch (e) {
      this.log('Init failure: ' + e);
      return;
    }

    this.inited = true;
  }

  // Displays the Start screen and hides the End screen.
  private showStart() {
    if (this.startRoot) { this.startRoot.enabled = true; }
    if (this.endRoot) { this.endRoot.enabled = false; }
  }

  // Displays the End screen and spawns balloons
  private showEnd(total) {
    if (this.startRoot) { this.startRoot.enabled = false; }
    if (this.endRoot) { this.endRoot.enabled = true; }

    const count = Math.min(this.maxOthers, Math.max(0, total));
    this.log(`Spawning ${count} balloons for total ${total}`);

    for (let i = 0; i < count; i++) {
      this.spawnRandomBalloon();
    }
  }

  // Instantiates one random balloon prefab in a random position
  private spawnRandomBalloon() {
    if (!this.balloonsParent || !this.balloonPrefabs || this.balloonPrefabs.length === 0) {
      this.log('Spawn skipped: missing container or prefabs'); return;
    }

    // Pick a random prefab
    const prefab = this.balloonPrefabs[Math.floor(Math.random() * this.balloonPrefabs.length)];
    const obj = prefab.instantiate(this.balloonsParent);
    if (!obj) return;

    // Randomize local position
    const tr = obj.getTransform();
    const x = this.randRange(-30, 30);
    const y = this.randRange(50, 100);
    const z = this.randRange(-50, 5);
    tr.setLocalPosition(new vec3(x, y, z));
  }

  // Returns a random number in the specified range
  private randRange(min: number, max: number) {
    return min + Math.random() * (max - min);
  }

  // Updates the total pledge count displayed to the user
  private updateTotalText(n: number) {
    if (!this.totalText) return;
    this.totalText.text = n.toLocaleString();
  }

  // Utility logger for debugging
  private log(msg: string) {
    print('[KindnessCounter] ' + msg);
  }

  // Retrieves the global pledge count from Supabase
  private async fetchAllTimeTotal(): Promise<number> {
    try {
      const { data, error } = await this.client.rpc('get_kindness_total_all');
      if (error) { this.log('get_kindness_total_all error: ' + error.message); return 0; }
      return Number(data || 0);
    } catch (e) {
      this.log('get_kindness_total_all exception: ' + e);
      return 0;
    }
  }

}