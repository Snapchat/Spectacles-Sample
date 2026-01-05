import Event from "SpectaclesInteractionKit.lspkg/Utils/Event"
import {clearTimeout, setTimeout} from "SpectaclesInteractionKit.lspkg/Utils/FunctionTimingUtils"
import {Tool, ToolCall, ToolResult} from "./AgentTypes"

/**
 * Executes tools with parameter validation and error handling
 * Manages all AI-powered tools in the system
 * Provides tool usage display and performance monitoring
 */
export class AgentToolExecutor {
  private tools: Map<string, Tool> = new Map()
  private toolDisplayText: Text | null = null
  private readonly TOOL_TIMEOUT = 15000 // 15 seconds to allow for AI streaming responses

  // Events for tool execution
  public onToolExecuted: Event<{tool: string; result: ToolResult; duration: number}> = new Event()
  public onToolFailed: Event<{tool: string; error: string; duration: number}> = new Event()

  constructor(toolDisplayText?: Text) {
    this.toolDisplayText = toolDisplayText || null
    print("AgentToolExecutor: Tool executor initialized")
  }

  // ================================
  // Tool Registration
  // ================================

  public registerTool(tool: Tool): void {
    if (this.tools.has(tool.name)) {
      print(`AgentToolExecutor: Tool '${tool.name}' already registered, replacing...`)
    }

    this.tools.set(tool.name, tool)
    print(`AgentToolExecutor: Tool '${tool.name}' registered successfully`)
  }

  public unregisterTool(toolName: string): void {
    if (this.tools.has(toolName)) {
      this.tools.delete(toolName)
      print(`AgentToolExecutor: Tool '${toolName}' unregistered`)
    } else {
      print(`AgentToolExecutor: Tool '${toolName}' not found for unregistration`)
    }
  }

  public listAvailableTools(): Tool[] {
    return Array.from(this.tools.values())
  }

  public getToolByName(toolName: string): Tool | undefined {
    return this.tools.get(toolName)
  }

  // ================================
  // Tool Execution
  // ================================

  public async executeTool(name: string, args: Record<string, unknown>): Promise<ToolResult> {
    const startTime = Date.now()

    try {
      // Validate tool exists
      const tool = this.tools.get(name)
      if (!tool) {
        const error = `Tool '${name}' not found`
        print(`AgentToolExecutor: ${error}`)
        print(`AgentToolExecutor: Available tools: ${Array.from(this.tools.keys()).join(", ")}`)
        return this.createErrorResult(error, Date.now() - startTime)
      }

      // Display tool usage
      this.displayToolUsage(name, args)

      // Validate parameters
      const validationResult = this.validateToolParameters(tool, args)
      if (!validationResult.valid) {
        const error = `Parameter validation failed: ${validationResult.error}`
        print(`AgentToolExecutor: ${error}`)
        return this.createErrorResult(error, Date.now() - startTime)
      }

      // Execute tool with timeout
      const result = await this.executeWithTimeout(tool, args)
      const executionTime = Date.now() - startTime

      // Update display with result
      this.displayToolResult(name, result, executionTime)

      // Fire success event
      this.onToolExecuted.invoke({tool: name, result, duration: executionTime})

      print(`AgentToolExecutor: Tool '${name}' executed successfully in ${executionTime}ms`)
      return result
    } catch (error) {
      const executionTime = Date.now() - startTime
      const errorMessage = `Tool execution failed: ${error}`

      print(`AgentToolExecutor: ${errorMessage}`)
      this.displayToolError(name, errorMessage, executionTime)

      // Fire error event
      this.onToolFailed.invoke({tool: name, error: errorMessage, duration: executionTime})

      return this.createErrorResult(errorMessage, executionTime)
    }
  }

  public async executeToolCall(toolCall: ToolCall): Promise<ToolResult> {
    try {
      const args = JSON.parse(toolCall.arguments)
      return await this.executeTool(toolCall.name, args)
    } catch (error) {
      const errorMessage = `Failed to parse tool call arguments: ${error}`
      print(`AgentToolExecutor: ${errorMessage}`)
      return this.createErrorResult(errorMessage, 0)
    }
  }

  // ================================
  // Tool Validation
  // ================================

  private validateToolParameters(tool: Tool, args: Record<string, unknown>): {valid: boolean; error?: string} {
    try {
      const parameters = tool.parameters

      // Check required parameters
      if (parameters.required && Array.isArray(parameters.required)) {
        for (const requiredParam of parameters.required) {
          if (!(requiredParam in args)) {
            return {
              valid: false,
              error: `Missing required parameter: ${requiredParam}`
            }
          }
        }
      }

      // Check parameter types if properties are defined
      if (parameters.properties) {
        for (const [paramName, paramValue] of Object.entries(args)) {
          const paramSpec = parameters.properties[paramName]
          if (paramSpec) {
            const isRequired = parameters.required && parameters.required.includes(paramName)
            const typeCheckResult = this.validateParameterType(paramName, paramValue, paramSpec, isRequired)
            if (!typeCheckResult.valid) {
              return typeCheckResult
            }
          }
        }
      }

      return {valid: true}
    } catch (error) {
      return {
        valid: false,
        error: `Parameter validation error: ${error}`
      }
    }
  }

  private validateParameterType(
    paramName: string,
    value: unknown,
    spec: any,
    isRequired: boolean = false
  ): {valid: boolean; error?: string} {
    if (!spec.type) {
      return {valid: true} // No type specified, skip validation
    }

    // Allow null for optional parameters
    if (value === null && !isRequired) {
      return {valid: true}
    }

    const actualType = typeof value
    const expectedType = spec.type

    // Handle different type validations
    switch (expectedType) {
      case "string":
        if (actualType !== "string") {
          return {valid: false, error: `Parameter '${paramName}' must be a string, got ${actualType}`}
        }
        break

      case "number":
        if (actualType !== "number") {
          return {valid: false, error: `Parameter '${paramName}' must be a number, got ${actualType}`}
        }
        break

      case "boolean":
        if (actualType !== "boolean") {
          return {valid: false, error: `Parameter '${paramName}' must be a boolean, got ${actualType}`}
        }
        break

      case "array":
        if (!Array.isArray(value)) {
          return {valid: false, error: `Parameter '${paramName}' must be an array, got ${actualType}`}
        }
        break

      case "object":
        if (value === null) {
          return {valid: false, error: `Parameter '${paramName}' must be an object, got null`}
        }
        if (Array.isArray(value)) {
          return {valid: false, error: `Parameter '${paramName}' must be an object, got array`}
        }
        if (actualType !== "object") {
          return {valid: false, error: `Parameter '${paramName}' must be an object, got ${actualType}`}
        }
        break

      default:
        // Unknown type, skip validation
        break
    }

    // Check enum values if specified
    if (spec.enum && Array.isArray(spec.enum)) {
      if (!spec.enum.includes(value)) {
        return {valid: false, error: `Parameter '${paramName}' must be one of: ${spec.enum.join(", ")}`}
      }
    }

    return {valid: true}
  }

  // ================================
  // Tool Execution Helpers
  // ================================

  private async executeWithTimeout(tool: Tool, args: Record<string, unknown>): Promise<ToolResult> {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error(`Tool execution timed out after ${this.TOOL_TIMEOUT}ms`))
      }, this.TOOL_TIMEOUT)

      tool
        .execute(args)
        .then((result) => {
          clearTimeout(timeoutId)
          resolve(result)
        })
        .catch((error) => {
          clearTimeout(timeoutId)
          reject(error)
        })
    })
  }

  private createErrorResult(error: string, executionTime: number): ToolResult {
    return {
      success: false,
      error: error,
      executionTime: executionTime
    }
  }

  // ================================
  // Display Methods
  // ================================

  public displayToolUsage(toolName: string, args: any): void {
    const displayMessage = `${toolName}(${JSON.stringify(args)})`

    if (this.toolDisplayText) {
      this.toolDisplayText.text = displayMessage
    }

    print(`AgentToolExecutor: ${displayMessage}`)
  }

  private displayToolResult(toolName: string, result: ToolResult, executionTime: number): void {
    let displayMessage: string

    if (result.success) {
      displayMessage = `${toolName} completed (${executionTime}ms)`
    } else {
      displayMessage = `${toolName} failed: ${result.error} (${executionTime}ms)`
    }

    if (this.toolDisplayText) {
      this.toolDisplayText.text = displayMessage
    }

    print(`AgentToolExecutor: ${displayMessage}`)
  }

  private displayToolError(toolName: string, error: string, executionTime: number): void {
    const displayMessage = `${toolName} error: ${error} (${executionTime}ms)`

    if (this.toolDisplayText) {
      this.toolDisplayText.text = displayMessage
    }

    print(`AgentToolExecutor: ${displayMessage}`)
  }

  // ================================
  // Utility Methods
  // ================================

  public setToolDisplayText(displayText: Text): void {
    this.toolDisplayText = displayText
    print("AgentToolExecutor: Tool display text updated")
  }

  public getToolExecutionStats(): {totalTools: number; toolNames: string[]} {
    return {
      totalTools: this.tools.size,
      toolNames: Array.from(this.tools.keys())
    }
  }

  public clearAllTools(): void {
    this.tools.clear()
    print("AgentToolExecutor: All tools cleared")
  }

  public async testTool(toolName: string, testArgs: Record<string, unknown>): Promise<void> {
    print(`AgentToolExecutor: 🧪 Testing tool '${toolName}'...`)

    const result = await this.executeTool(toolName, testArgs)

    if (result.success) {
      print(`AgentToolExecutor: Tool test passed: ${toolName}`)
    } else {
      print(`AgentToolExecutor: Tool test failed: ${toolName} - ${result.error}`)
    }
  }
}
