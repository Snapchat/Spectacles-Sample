@component
export class LeaderboardExample extends BaseScriptComponent {
  @input
  leaderboardModule: LeaderboardModule

  @input
  textLogs: Text

  private leaderboardInstance: any
  private leaderboardName = "EXAMPLE_LEADERBOARD"
  private participants = ["A", "B", "C", "D"]
  private currentParticipantIndex = 0
  private isUpdatePhase = false

  onAwake() {
    this.print("Starting LeaderboardExample")
    if (!this.leaderboardModule) {
      this.leaderboardModule = require("LensStudio:LeaderboardModule")
    }
    this.createLeaderboard()
  }

  print(message: string): void {
    const logMessage = `[LeaderboardExample] ${message}`
    print(logMessage)

    // Also display in the text component if available
    if (this.textLogs) {
      // Append the new log to existing text
      const currentText = this.textLogs.text || ""
      this.textLogs.text = currentText + "\n" + logMessage
    }
  }

  createLeaderboard(): void {
    this.print("Creating leaderboard...")

    const leaderboardCreateOptions = Leaderboard.CreateOptions.create()
    leaderboardCreateOptions.name = this.leaderboardName
    leaderboardCreateOptions.ttlSeconds = 86400 // 24 hours
    leaderboardCreateOptions.orderingType = Leaderboard.OrderingType.Descending // Higher scores are better

    // Get or create the leaderboard
    this.leaderboardModule.getLeaderboard(
      leaderboardCreateOptions,
      (leaderboard) => {
        this.leaderboardInstance = leaderboard
        this.print(`Leaderboard "${this.leaderboardName}" created/retrieved successfully`)
        this.print(`Leaderboard Name = ${leaderboard.name}`)
        this.print(`Ordering Type = ${leaderboard.orderingType}`)

        // First check current leaderboard entries
        this.checkCurrentLeaderboard()
      },
      (status) => {
        this.print(`Failed to get/create leaderboard, status: ${status}`)
      }
    )
  }

  checkCurrentLeaderboard(): void {
    this.print("Retrieving existing leaderboard entries...")

    const retrievalOptions = Leaderboard.RetrievalOptions.create()
    retrievalOptions.usersLimit = 100
    retrievalOptions.usersType = Leaderboard.UsersType.Global

    this.leaderboardInstance.getLeaderboardInfo(
      retrievalOptions,
      (otherRecords, currentUserRecord) => {
        if (otherRecords && otherRecords.length > 0) {
          this.print(`Found ${otherRecords.length} existing entries in leaderboard`)
        } else {
          this.print("No existing entries found in leaderboard")
        }

        if (currentUserRecord) {
          this.print(`Current user has score: ${currentUserRecord.score}`)
        }

        // Start adding participants
        this.scheduleNextAction()
      },
      (status) => {
        this.print(`Failed to retrieve leaderboard info, status: ${status}`)
        // Still proceed with adding participants
        this.scheduleNextAction()
      }
    )
  }

  scheduleNextAction(): void {
    if (!this.isUpdatePhase) {
      // First phase: Adding participants
      if (this.currentParticipantIndex < this.participants.length) {
        const participant = this.participants[this.currentParticipantIndex]

        this.print(`Scheduling to add participant ${participant} in 5 seconds...`)
        this.scheduleAfterDelay(() => this.addParticipant(participant), 5)
      } else {
        // Transition to update phase
        this.isUpdatePhase = true
        this.currentParticipantIndex = 0

        this.print("All participants added. Waiting 10 seconds before starting updates...")
        this.scheduleAfterDelay(() => this.scheduleNextAction(), 10)
      }
    } else {
      // Second phase: Updating scores
      if (this.currentParticipantIndex < this.participants.length) {
        const participant = this.participants[this.currentParticipantIndex]

        this.print(`Scheduling to update participant ${participant}'s score in 5 seconds...`)
        this.scheduleAfterDelay(() => this.updateParticipantScore(participant), 5)
      } else {
        this.print("Example completed. Displaying final leaderboard:")
        this.displayLeaderboard()
      }
    }
  }

  // Helper function to create and use DelayedCallbackEvent
  scheduleAfterDelay(callback: () => void, seconds: number): void {
    const delayedEvent = this.createEvent("DelayedCallbackEvent")
    delayedEvent.bind(() => {
      callback()
    })
    delayedEvent.reset(seconds)
  }

  addParticipant(participant: string): void {
    const score = Math.floor(Math.random() * 100) + 1 // Random score between 1-100
    this.print(`Adding participant ${participant} with score: ${score}`)

    this.submitScore(score, participant)
  }

  updateParticipantScore(participant: string): void {
    const newScore = Math.floor(Math.random() * 500) + 100 // Higher random score between 100-600
    this.print(`Updating participant ${participant}'s score to: ${newScore}`)

    this.submitScore(newScore, participant)
  }

  submitScore(score: number, participantLabel: string): void {
    this.print(`Submitting score ${score} for ${participantLabel}...`)

    this.leaderboardInstance.submitScore(
      score,
      (userInfo) => {
        this.print(`Successfully submitted score for ${participantLabel}`)
        if (!isNull(userInfo)) {
          this.print(
            `[${participantLabel}] User info: ${
              userInfo.snapchatUser.displayName ? userInfo.snapchatUser.displayName : "Unknown"
            } score: ${userInfo.score}`
          )
        }

        // Display the current leaderboard state
        this.displayLeaderboard()

        // Move to next participant
        this.currentParticipantIndex++
        this.scheduleNextAction()
      },
      (status) => {
        this.print(`Failed to submit score for ${participantLabel}, status: ${status}`)

        // Still move to next participant even if this one failed
        this.currentParticipantIndex++
        this.scheduleNextAction()
      }
    )
  }

  displayLeaderboard(): void {
    this.print("Retrieving current leaderboard state...")

    const retrievalOptions = Leaderboard.RetrievalOptions.create()
    retrievalOptions.usersLimit = 10
    retrievalOptions.usersType = Leaderboard.UsersType.Global

    this.leaderboardInstance.getLeaderboardInfo(
      retrievalOptions,
      (otherRecords, currentUserRecord) => {
        this.print("===== CURRENT LEADERBOARD =====")

        if (currentUserRecord && currentUserRecord.snapchatUser) {
          this.print(
            `Current user: ${
              currentUserRecord.snapchatUser.displayName ? currentUserRecord.snapchatUser.displayName : "Unknown"
            }, Score: ${currentUserRecord.score}`
          )
        }

        if (otherRecords && otherRecords.length > 0) {
          this.print(`Total entries: ${otherRecords.length}`)
          otherRecords.forEach((record, index) => {
            if (record && record.snapchatUser) {
              this.print(
                `#${index + 1}: ${
                  record.snapchatUser.displayName ? record.snapchatUser.displayName : "Unknown"
                }, Score: ${record.score}`
              )
            }
          })
        } else {
          this.print("No other records found in the leaderboard.")
        }

        this.print("==============================")
      },
      (status) => {
        this.print(`Failed to retrieve leaderboard info, status: ${status}`)
      }
    )
  }
}
