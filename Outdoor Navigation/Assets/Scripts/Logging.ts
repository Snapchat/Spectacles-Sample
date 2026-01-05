import { Queue } from "./Queue"

export class Logger {
  bus: LoggerBus
  topic: string

  public log(message: string) {
    this.bus.write(this.topic, message)
  }
}

// place to write things out exists ahead of component instantiation
class LoggerBus {
  listener?: (topic: string, message: string) => void

  write(topic: string, message: string) {
    this.buffered.push([topic, message])
    this.flush()
  }

  flush() {
    if (!this.listener) {
      return
    }
    this.buffered.forEach(([topic, message]) => {
      this.listener(topic, message)
    })
    this.buffered = []
  }

  private buffered: [string, string][] = []
}

@component
export class LoggerVisualization extends BaseScriptComponent {
  @input private logLimit: number = 10
  @input private loggerOutput: Text

  private static theLoggerBus: LoggerBus

  private logQueue: Queue<string>

  static get busInstance(): LoggerBus {
    if (!LoggerVisualization.theLoggerBus) {
      LoggerVisualization.theLoggerBus = new LoggerBus()
    }
    return LoggerVisualization.theLoggerBus
  }
  static createLogger(topic: string): Logger {
    const logger = new Logger()
    logger.bus = LoggerVisualization.busInstance
    logger.topic = topic
    return logger
  }

  write(topic: string, message: string) {
    const localText = `${topic}: ${message}`
    if (this.loggerOutput != null && this.loggerOutput != undefined) {
      this.logQueue.enqueue(localText)
      let formatedLog = this.logQueue.peek(0)
      for (let index = 0; index < this.logQueue.size(); index++) {
        formatedLog += "\n" + this.logQueue.peek(index)
      }
      this.loggerOutput.text = formatedLog
    } else {
      print("no textLogger: " + localText)
    }

    print(localText)
  }

  onAwake() {
    this.logQueue = new Queue<string>(this.logLimit)
    this.write = this.write.bind(this)
    LoggerVisualization.busInstance.listener = this.write
  }
}
