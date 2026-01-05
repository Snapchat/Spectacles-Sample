import {RectangleButton} from "SpectaclesUIKit.lspkg/Scripts/Components/Button/RectangleButton"
import {createClient} from "SupabaseClient.lspkg/supabase-snapcloud"
import {SnapCloudRequirements} from "../SnapCloudRequirements"

@component
export class TableConnector extends BaseScriptComponent {
  // Supabase Configuration - Centralized via SnapCloudRequirements
  @input
  @hint("Reference to SnapCloudRequirements for centralized Supabase configuration")
  public snapCloudRequirements: SnapCloudRequirements

  // Interactive Elements
  @input
  @allowUndefined
  @hint("Optional: RectangleButton to trigger data retrieval (from Spectacles UI Kit)")
  public dataRetrievalButton: RectangleButton

  @input
  @allowUndefined
  @hint("Optional: Text component to display logs on device")
  public logText: Text

  private client: any
  private uid: string
  private isConnected: boolean = false
  private logMessages: string[] = []
  private maxLogMessages: number = 20

  // The three tables in your database
  private readonly tableName: string = "test_table"

  onAwake() {
    this.setupInteractions()
    this.createEvent("OnStartEvent").bind(() => {
      this.onStart()
    })
  }

  onStart() {
    this.initSupabase()
  }

  async initSupabase() {
    if (!this.snapCloudRequirements || !this.snapCloudRequirements.isConfigured()) {
      this.log("SnapCloudRequirements not configured")
      return
    }

    const supabaseProject = this.snapCloudRequirements.getSupabaseProject()

    // Configure client options with realtime heartbeat fix
    const options = {
      realtime: {
        // Temporary fix due to a known alpha limitation, set the heartbeatIntervalMs to 2500
        heartbeatIntervalMs: 2500
      }
    }

    this.client = createClient(supabaseProject.url, supabaseProject.publicToken, options)
    print("Client is ready")
    if (this.client) {
      await this.signInUser()
      print("User is authenticated")
    }
  }

  async signInUser() {
    const {data, error} = await this.client.auth.signInWithIdToken({
      provider: "snapchat",
      token: ""
    })
    print("Sign in user")
    if (error) {
      this.log("Sign in error: " + JSON.stringify(error))
    } else {
      const {user, session} = data
      print(`User: ${JSON.stringify(user)}`)
      print(`Session: ${JSON.stringify(session)}`)

      this.uid = JSON.stringify(user.id).replace(/^"(.*)"$/, "$1")
    }
  }

  async testConnectionAndRun() {
    if (!this.uid) {
      this.log("Not authenticated")
      return
    }

    this.log("Testing connection...")
    await this.testConnection()
  }

  onDestroy() {
    if (this.client) {
      this.client.removeAllChannels()
    }
  }

  /**
   * Custom logging method that outputs to both console and UI text
   */
  private log(message: string) {
    // Always log to console
    print(message)

    // Also log to UI if text component is available
    if (this.logText) {
      this.logMessages.push(message)

      // Keep only the most recent messages
      if (this.logMessages.length > this.maxLogMessages) {
        this.logMessages = this.logMessages.slice(-this.maxLogMessages)
      }

      // Update the text component
      this.logText.text = this.logMessages.join("\n")
    }
  }

  /**
   * Clear the log display
   */
  public clearLogs() {
    this.logMessages = []
    if (this.logText) {
      this.logText.text = ""
    }
  }

  /**
   * Setup interactive elements (button only)
   */
  private setupInteractions() {
    // Setup button interaction if provided
    if (this.dataRetrievalButton) {
      this.dataRetrievalButton.onTriggerUp.add(() => {
        this.log("Data retrieval button pressed!")
        this.retrieveLatestData()
      })
      this.log("Button interaction configured")
    } else {
      this.log("No data retrieval button assigned. You can manually call retrieveLatestData()")
    }
  }

  /**
   * Test the connection to Supabase
   */
  public async testConnection() {
    if (!this.client) {
      this.log("Client not initialized")
      return
    }

    if (!this.uid) {
      this.log("User not authenticated - cannot test connection")
      this.log("Authentication is required for Snap Cloud")
      return
    }

    this.log("Testing Supabase connection...")

    try {
      // Try to fetch from the main table (this will work even if table is empty)
      const {data, error} = await this.client.from(this.tableName).select("*").limit(1)

      if (error) {
        this.log(`Connection failed: ${JSON.stringify(error)}`)
        this.log(`Make sure table '${this.tableName}' exists in your Snap Cloud project`)
        this.log(`Check RLS (Row Level Security) policies in the dashboard`)
        return
      }

      this.isConnected = true
      this.log("Successfully connected to Snap Cloud!")
      this.log(`Table '${this.tableName}' is accessible`)

      // Test inserting a sample record
      await this.insertTestRecord()

      // Test selecting records
      await this.getAllRecords()

      // Test all other tables
      await this.testAllTables()
    } catch (error) {
      this.log(`Connection error: ${error}`)
    }
  }

  /**
   * Test all tables to verify they exist and are accessible
   */
  public async testAllTables() {
    this.log("Testing all database tables...")

    const tables = ["user_interactions", "user_preferences"]

    for (const table of tables) {
      try {
        const {data, error} = await this.client.from(table).select("*").limit(3)

        if (error) {
          this.log(`Table '${table}': ${error.message} - May not exist or need RLS policies`)
        } else {
          this.log(`Table '${table}': ${data.length} records found`)

          // Show sample data if available
          if (data.length > 0) {
            const sample = data[0]
            const keys = Object.keys(sample).slice(0, 3) // Show first 3 columns
            this.log(
              `   Sample: ${keys.map((key) => `${key}=${JSON.stringify(sample[key]).substring(0, 30)}`).join(", ")}`
            )
          }
        }
      } catch (error) {
        this.log(`Table '${table}': Error - ${error}`)
      }
    }

    // Test inserting into other tables
    await this.testOtherTableInserts()
  }

  /**
   * Test inserting data into other tables
   */
  public async testOtherTableInserts() {
    this.log("Testing inserts into other tables...")

    // Test user_interactions
    try {
      await this.logUserInteraction("test_connection", {
        source: "supabase_connector",
        test: true
      })
    } catch (error) {
      this.log(`User interaction test failed: ${error}`)
    }

    // Test user_preferences (if not exists, create sample)
    try {
      const testUserId = `test_user_${Date.now()}`
      const preferences = {
        audio: {volume: 0.7, sound_effects: true},
        display: {brightness: 0.8, color_mode: "vivid"},
        test_mode: true
      }

      const {data, error} = await this.client
        .from("user_preferences")
        .insert({
          user_id: testUserId,
          preferences: JSON.stringify(preferences),
          updated_at: new Date().toISOString()
        })
        .select()

      if (error) {
        this.log(`User preferences test: ${error.message}`)
      } else {
        this.log(`User preferences test: Sample user created`)
      }
    } catch (error) {
      this.log(`User preferences test failed: ${error}`)
    }
  }

  /**
   * Insert a test record to verify database write access
   */
  public async insertTestRecord() {
    this.log("Inserting test record...")

    const testData = {
      message: "Hello from Lens Studio!",
      sender: "Spectacles User",
      timestamp: new Date().toISOString(),
      lens_session_id: `session_${Date.now()}`
    }

    try {
      const {data, error} = await this.client.from(this.tableName).insert(testData).select()

      if (error) {
        this.log(`Insert failed: ${error.message}`)
        this.log(`Error: ${JSON.stringify(error)}`)
      } else {
        this.log("Test record inserted successfully!")
        this.log(`Inserted data: ${JSON.stringify(data)}`)
      }
    } catch (error) {
      this.log(`Insert error: ${error}`)
    }
  }

  /**
   * Retrieve all records from the test table
   */
  public async getAllRecords() {
    this.log("Fetching all records...")

    try {
      const {data, error} = await this.client.from(this.tableName).select("*").limit(5)

      if (error) {
        this.log(`Select failed: ${error.message}`)
        this.log(`   Error details: ${JSON.stringify(error)}`)
      } else {
        this.log(`Retrieved ${data.length} records:`)

        data.forEach((record: any, index: number) => {
          this.log(`  ${index + 1}. ${record.message || "No message"} (${record.sender || "Unknown"})`)
        })
      }
    } catch (error) {
      this.log(`Select error: ${error}`)
    }
  }

  /**
   * Generic method to insert data into any table
   */
  public async insertIntoTable(table: string, data: any) {
    const {data: result, error} = await this.client.from(table).insert(data).select()

    return {data: result, error}
  }

  /**
   * Generic method to select data from any table
   */
  public async selectFromTable(table: string, columns: string = "*") {
    const {data, error} = await this.client.from(table).select(columns)

    return {data, error}
  }

  /**
   * Generic method to update data in any table
   * @param table - Table name
   * @param data - Data to update
   * @param matchColumn - Column to match (e.g., "id")
   * @param matchValue - Value to match
   */
  public async updateTable(table: string, data: any, matchColumn: string, matchValue: any) {
    const {data: result, error} = await this.client.from(table).update(data).eq(matchColumn, matchValue).select()

    return {data: result, error}
  }

  /**
   * Generic method to delete data from any table
   * @param table - Table name
   * @param matchColumn - Column to match (e.g., "id")
   * @param matchValue - Value to match
   */
  public async deleteFromTable(table: string, matchColumn: string, matchValue: any) {
    const {data, error} = await this.client.from(table).delete().eq(matchColumn, matchValue).select()

    return {data, error}
  }

  /**
   * Example: Log user interaction for analytics
   */
  public async logUserInteraction(action: string, data: any = {}) {
    const interactionData = {
      action: action,
      data: JSON.stringify(data),
      timestamp: new Date().toISOString(),
      session_id: `lens_${Date.now()}`
    }

    try {
      await this.insertIntoTable("user_interactions", interactionData)
      this.log(`Logged interaction: ${action}`)
    } catch (error) {
      this.log(`Failed to log interaction: ${error}`)
    }
  }

  /**
   * Example: Get user preferences
   */
  public async getUserPreferences(userId: string): Promise<any> {
    try {
      const {data, error} = await this.client.from("user_preferences").select("*").eq("user_id", userId)

      if (error) {
        this.log(`Failed to get user preferences: ${error.message}`)
        return null
      }

      return data.length > 0 ? data[0] : null
    } catch (error) {
      this.log(`Failed to get user preferences: ${error}`)
    }

    return null
  }

  /**
   * Retrieve and display latest data from all tables (triggered by button/pinch)
   */
  public async retrieveLatestData() {
    this.log("Retrieving latest data from all tables...")

    // Get latest messages
    await this.getLatestMessages()

    // Get recent user interactions
    await this.getRecentInteractions()

    // Get user preferences
    await this.getRandomUserPreferences()

    this.log("Data retrieval completed!")
  }

  /**
   * Get latest messages from main messages table
   */
  private async getLatestMessages() {
    try {
      const {data, error} = await this.client.from(this.tableName).select("*").limit(3)

      if (error) {
        this.log(`Could not retrieve messages: ${error.message}`)
        this.log(`   Error details: ${JSON.stringify(error)}`)
      } else {
        this.log(`Latest Messages (${data.length}):`)

        data.forEach((msg: any, index: number) => {
          this.log(`  ${index + 1}. "${msg.message || "No message"}" by ${msg.sender || "Unknown"}`)
        })
      }
    } catch (error) {
      this.log(`Error retrieving messages: ${error}`)
    }
  }

  /**
   * Get recent user interactions
   */
  private async getRecentInteractions() {
    try {
      const {data, error} = await this.client.from("user_interactions").select("*").limit(3)

      if (error) {
        this.log(`Could not retrieve interactions: ${error.message}`)
        if (error.code === "PGRST116") {
          this.log(`   Create the 'user_interactions' table using the provided CSV data`)
        }
      } else {
        this.log(`Recent Interactions (${data.length}):`)

        data.forEach((interaction: any, index: number) => {
          this.log(`  ${index + 1}. ${interaction.action || "Unknown action"}`)
        })
      }
    } catch (error) {
      this.log(`Error retrieving interactions: ${error}`)
    }
  }

  /**
   * Get a random user's preferences
   */
  private async getRandomUserPreferences() {
    try {
      const {data, error} = await this.client.from("user_preferences").select("*").limit(1)

      if (error) {
        this.log(`Could not retrieve user preferences: ${error.message}`)
      } else if (data.length > 0) {
        const user = data[0]
        this.log(`Sample User Preferences:`)
        this.log(`  User: ${user.user_id}`)

        try {
          const prefs = JSON.parse(user.preferences)
          if (prefs.audio) {
            this.log(`  Audio: Volume ${prefs.audio.volume}, SFX ${prefs.audio.sound_effects}`)
          }
          if (prefs.display) {
            this.log(`  Display: Brightness ${prefs.display.brightness}, Mode ${prefs.display.color_mode}`)
          }
        } catch (parseError) {
          this.log(`  Preferences: ${user.preferences.substring(0, 100)}...`)
        }
      } else {
        this.log(`No user preferences found`)
      }
    } catch (error) {
      this.log(`Error retrieving user preferences: ${error}`)
    }
  }

  /**
   * Public methods for external scripts to use
   */
  public isSupabaseConnected(): boolean {
    return this.isConnected
  }

  public getClient(): any {
    return this.client
  }

  public getUserId(): string {
    return this.uid
  }

  /**
   * Public method to manually trigger data retrieval
   */
  public async manualDataRetrieval() {
    await this.retrieveLatestData()
  }

  /**
   * Get current log messages as a string
   */
  public getLogMessages(): string {
    return this.logMessages.join("\n")
  }
}
