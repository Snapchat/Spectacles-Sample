/**
 * TextLimiter Utility - Enforces character limits across the system
 * 
 * This utility ensures all text components respect the character limits
 * defined by the existing UI components to prevent overflow or text cutting.
 */

// Character limit constants from existing components
export const CHARACTER_LIMITS = {
  // From AdvancedSlideLayoutSummary.ts
  SUMMARY_TITLE: 157,
  SUMMARY_CONTENT: 785,
  MAX_SUMMARY_CARDS: 10,
  
  // From AdvancedSlideLayoutRearrange.ts  
  USER_CARD_TEXT: 200,
  BOT_CARD_TEXT: 300,
  MAX_CHAT_CARDS: 50,
  
  // From SimpleMindNodeManager.ts
  TEXT_NODE_TITLE: 20,
  TEXT_NODE_CONTENT: 95,
  IMAGE_NODE_TITLE: 26,
  IMAGE_NODE_CONTENT: 200,
  MODEL_NODE_TITLE: 22,
  NODE_TITLE_GENERAL: 100,
  NODE_DESCRIPTION_GENERAL: 200,
  MAX_NODES: 50
} as const;

export class TextLimiter {
  /**
   * Limit text to specified character count with optional suffix
   */
  public static limitText(text: string, limit: number, suffix: string = '...'): string {
    if (!text || text.length <= limit) {
      return text || '';
    }
    
    const truncatedLength = limit - suffix.length;
    if (truncatedLength <= 0) {
      return suffix.substring(0, limit);
    }
    
    return text.substring(0, truncatedLength) + suffix;
  }
  
  /**
   * Validate if text meets length requirement
   */
  public static validateLength(text: string, limit: number): boolean {
    return text && text.length <= limit;
  }
  
  /**
   * Get optimal break point for text truncation (word boundaries)
   */
  public static getOptimalBreakPoint(text: string, limit: number): number {
    if (!text || text.length <= limit) {
      return text ? text.length : 0;
    }
    
    const maxLength = limit - 3; // Account for '...'
    
    // Find last space before limit
    let breakPoint = maxLength;
    for (let i = maxLength; i >= 0; i--) {
      if (text[i] === ' ') {
        breakPoint = i;
        break;
      }
    }
    
    // If no space found, just use character limit
    if (breakPoint === 0) {
      return maxLength;
    }
    
    return breakPoint;
  }
  
  /**
   * Split long text into multiple chunks respecting character limits
   */
  public static splitLongText(text: string, limit: number): string[] {
    if (!text || text.length <= limit) {
      return [text || ''];
    }
    
    const chunks: string[] = [];
    let currentIndex = 0;
    
    while (currentIndex < text.length) {
      const remainingText = text.substring(currentIndex);
      
      if (remainingText.length <= limit) {
        chunks.push(remainingText);
        break;
      }
      
      const breakPoint = this.getOptimalBreakPoint(remainingText, limit);
      chunks.push(remainingText.substring(0, breakPoint));
      
      currentIndex += breakPoint;
      
      // Skip spaces at the beginning of next chunk
      while (currentIndex < text.length && text[currentIndex] === ' ') {
        currentIndex++;
      }
    }
    
    return chunks;
  }
  
  /**
   * Truncate text at word boundary for better readability
   */
  public static truncateAtWordBoundary(text: string, limit: number): string {
    if (!text || text.length <= limit) {
      return text || '';
    }
    
    const breakPoint = this.getOptimalBreakPoint(text, limit);
    return text.substring(0, breakPoint) + '...';
  }
  
  /**
   * Get character count information
   */
  public static getCharacterInfo(text: string, limit: number): {
    length: number;
    remaining: number;
    isOverLimit: boolean;
    percentUsed: number;
  } {
    const length = text ? text.length : 0;
    return {
      length,
      remaining: Math.max(0, limit - length),
      isOverLimit: length > limit,
      percentUsed: Math.min(100, (length / limit) * 100)
    };
  }
  
  /**
   * Log character limit violations for debugging
   */
  public static logLimitViolation(content: string, limit: number, type: string): void {
    const info = this.getCharacterInfo(content, limit);
    if (info.isOverLimit) {
      print(`TextLimiter: ⚠️ Character limit exceeded for ${type}: ${info.length}/${limit} chars`);
      print(`TextLimiter: 📝 Content preview: "${content.substring(0, 50)}..."`);
    }
  }
  
  /**
   * Validate content against multiple character limits
   */
  public static validateMultipleLimits(content: { [key: string]: string }, limits: { [key: string]: number }): boolean {
    let allValid = true;
    
    for (const [key, text] of Object.entries(content)) {
      const limit = limits[key];
      if (limit && !this.validateLength(text, limit)) {
        this.logLimitViolation(text, limit, key);
        allValid = false;
      }
    }
    
    return allValid;
  }
}
