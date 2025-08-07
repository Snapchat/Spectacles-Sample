import { SummaryComponent } from '../Components/SummaryComponent';
import { SummarySection } from '../Agents/AgentTypes';

/**
 * SummaryExtensions - Utility class to extend AgenticSummary with public methods for adding summary cards
 * 
 * This utility provides a clean way to add summary cards to AgenticSummary from external components
 * while maintaining compatibility with the existing card system.
 */
export class SummaryExtensions {
  
  /**
   * Add a summary card to the AgenticSummary component
   */
  public static addSummaryCard(summaryLayout: SummaryComponent, summarySection: SummarySection, index: number): boolean {
    if (!summaryLayout || !summarySection) {
      print(`SummaryExtensions: Invalid parameters - summaryLayout: ${!!summaryLayout}, summarySection: ${!!summarySection}`);
      return false;
    }
    
    try {
      // Access the AgenticSummary component's internal methods through type assertion
      const layoutAny = summaryLayout as any;
      
      // Check if the component is initialized
      if (!layoutAny.initialized) {
        print(`SummaryExtensions: SummaryComponent not initialized yet`);
        return false;
      }
      
      // Check if we're in dynamic mode (non-test mode)
      if (!layoutAny.testMode) {
        print(`SummaryExtensions: Dynamic mode detected. Current cards: ${layoutAny.cards ? layoutAny.cards.length : 0}, Requested index: ${index}`);
        
        // In dynamic mode, create the card if it doesn't exist
        if (!layoutAny.cards || index >= layoutAny.cards.length) {
          print(`SummaryExtensions: Need to create dynamic card at index ${index}`);
          
          // Use the new dynamic card creation method
          if (layoutAny.createDynamicCard && typeof layoutAny.createDynamicCard === 'function') {
            print(`SummaryExtensions: Calling createDynamicCard with title: "${summarySection.title.substring(0, 50)}..."`);
            const createdIndex = layoutAny.createDynamicCard({
              title: summarySection.title,
              content: summarySection.content
            });
            print(`SummaryExtensions: createDynamicCard returned index: ${createdIndex}`);
            return createdIndex >= 0;
          } else {
            print(`SummaryExtensions: createDynamicCard method not available`);
            return false;
          }
        }
      }
      
      // Check if cards array exists and index is valid
      if (!layoutAny.cards || index < 0 || index >= layoutAny.cards.length) {
        print(`SummaryExtensions: Invalid index ${index} for cards array`);
        return false;
      }
      
      // Get the card at the specified index
      const card = layoutAny.cards[index];
      if (!card) {
        print(`SummaryExtensions: Card at index ${index} not found`);
        return false;
      }
      
      // Populate the card with the summary content
      if (layoutAny.populateCardContent && typeof layoutAny.populateCardContent === 'function') {
        layoutAny.populateCardContent(card, {
          title: summarySection.title,
          content: summarySection.content
        });
        return true;
      }
      
      print(`SummaryExtensions: populateCardContent method not available`);
      return false;
      
    } catch (error) {
      print(`SummaryExtensions: Error adding summary card: ${error}`);
    }
    
    return false;
  }
  
  /**
   * Update multiple summary cards at once
   */
  public static updateSummaryCards(summaryLayout: SummaryComponent, summaryData: SummarySection[]): number {
    if (!summaryLayout || !summaryData) {
      return 0;
    }
    
    let updatedCount = 0;
    
    for (let i = 0; i < summaryData.length; i++) {
      if (SummaryExtensions.addSummaryCard(summaryLayout, summaryData[i], i)) {
        updatedCount++;
      }
    }
    
    print(`SummaryExtensions: Updated ${updatedCount} summary cards`);
    return updatedCount;
  }
  
  /**
   * Get the total number of cards in the AgenticSummary component
   */
  public static getCardCount(summaryLayout: SummaryComponent): number {
    if (!summaryLayout) {
      return 0;
    }
    
    try {
      const layoutAny = summaryLayout as any;
      return layoutAny.cards ? layoutAny.cards.length : 0;
    } catch (error) {
      print(`SummaryExtensions: Error getting card count: ${error}`);
      return 0;
    }
  }
  
  /**
   * Check if the AgenticSummary component is ready for adding cards
   */
  public static isReady(summaryLayout: SummaryComponent): boolean {
    if (!summaryLayout) {
      return false;
    }
    
    try {
      const layoutAny = summaryLayout as any;
      return layoutAny.initialized === true && 
             layoutAny.cards !== null && 
             layoutAny.cards !== undefined;
    } catch (error) {
      print(`SummaryExtensions: Error checking readiness: ${error}`);
      return false;
    }
  }
  
  /**
   * Calculate estimated card size based on content length
   */
  private static calculateCardSize(content: string): vec3 {
    // Base size
    const baseWidth = 25;
    const baseHeight = 5;
    const baseDepth = 3;
    
    // Estimate lines based on content length (approximate)
    const charsPerLine = 45;
    const lines = Math.ceil(content.length / charsPerLine);
    const lineHeight = 1.2;
    
    // Calculate height based on line count
    const height = Math.max(baseHeight, baseHeight + (lines - 1) * lineHeight);
    
    return new vec3(baseWidth, height, baseDepth);
  }
  
  /**
   * Clear all summary cards (reset to default state)
   */
  public static clearSummaryCards(summaryLayout: SummaryComponent): boolean {
    if (!summaryLayout) {
      return false;
    }
    
    try {
      const layoutAny = summaryLayout as any;
      
      // In dynamic mode, we need to destroy all cards and reset
      if (!layoutAny.testMode) {
        // Destroy all dynamic cards
        if (layoutAny.cards && Array.isArray(layoutAny.cards)) {
          layoutAny.cards.forEach((card: any) => {
            if (card && card.destroy) {
              card.destroy();
            }
          });
          layoutAny.cards = [];
          layoutAny.numberOfCards = 0;
          layoutAny.currentIndex = 1; // Reset to default center position
          print(`SummaryExtensions: Cleared all dynamic cards`);
        }
        return true;
      } else {
        // In test mode, clear content from all cards
        if (layoutAny.cards && Array.isArray(layoutAny.cards)) {
          for (let i = 0; i < layoutAny.cards.length; i++) {
            const card = layoutAny.cards[i];
            if (card && layoutAny.populateCardContent && typeof layoutAny.populateCardContent === 'function') {
              // Empty the card content
              layoutAny.populateCardContent(card, {
                title: "",
                content: ""
              });
            }
          }
        }
      }
      
      // Reset to initial state if method exists
      if (layoutAny.layoutInitialCards && typeof layoutAny.layoutInitialCards === 'function') {
        layoutAny.layoutInitialCards();
        return true;
      }
      
      print(`SummaryExtensions: Cards cleared`);
      return true;
      
    } catch (error) {
      print(`SummaryExtensions: Error clearing summary cards: ${error}`);
      return false;
    }
  }
  
  /**
   * Get current card information for debugging
   */
  public static getCardInfo(summaryLayout: SummaryComponent, index: number): any {
    if (!summaryLayout) {
      return null;
    }
    
    try {
      const layoutAny = summaryLayout as any;
      
      if (!layoutAny.cards || index < 0 || index >= layoutAny.cards.length) {
        return null;
      }
      
      const card = layoutAny.cards[index];
      if (!card) {
        return null;
      }
      
      return {
        index: index,
        cardName: card.name,
        enabled: card.enabled,
        position: card.getTransform().getLocalPosition(),
        rotation: card.getTransform().getLocalRotation()
      };
      
    } catch (error) {
      print(`SummaryExtensions: Error getting card info: ${error}`);
      return null;
    }
  }
}
