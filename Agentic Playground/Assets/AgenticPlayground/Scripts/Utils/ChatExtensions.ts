import { ChatComponent } from '../Components/ChatComponent';
import { CardData, CardType } from '../../../SpectaclesUIKitBeta.lspkg/Scripts/Components/SlideLayout/AdvancedCardManager';

/**
 * ChatExtensions - Utility class to extend AgenticChat with public methods for adding cards
 * 
 * This utility provides a clean way to add cards to AgenticChat from external components
 * while maintaining compatibility with the existing card system.
 */
export class ChatExtensions {
  
  /**
   * Add a user message card to the AgenticChat component
   */
  public static addUserCard(agenticChat: ChatComponent, message: string): boolean {
    if (!agenticChat || !message) {
      return false;
    }
    
    try {
      // Access private methods through type assertion
      const chatAny = agenticChat as any;
      
      // Get the next card index
      const newIndex = chatAny.cardData ? chatAny.cardData.length : 0;
      
      // Create card data
      const cardData: CardData = {
        id: newIndex,
        type: CardType.User,
        textContent: message,
        size: chatAny.cardManager ? chatAny.cardManager.calculateCardSize(message) : { width: 300, height: 100 },
        sceneObject: null
      };
      
      // Instantiate the card using the user card prefab
      if (chatAny.userCardPrefab) {
        const cardObject = chatAny.userCardPrefab.instantiate(agenticChat.getSceneObject());
        cardObject.name = `Card_${newIndex}_User`;
        cardData.sceneObject = cardObject;
        cardObject.enabled = false; // Start hidden
        
        // Set up the card content
        if (typeof chatAny.setupCardContent === 'function') {
          chatAny.setupCardContent(cardData);
        }
        
        // Add to arrays
        if (chatAny.cards) {
          chatAny.cards.push(cardObject);
        }
        if (chatAny.cardData) {
          chatAny.cardData.push(cardData);
        }
        
        // 🔥 CRITICAL: Update currentIndex to show the latest cards in chronological order
        chatAny.currentIndex = newIndex;
        
        // Update layout to show the newest card
        if (typeof chatAny.updateCardLayoutToIndex === 'function') {
          chatAny.updateCardLayoutToIndex(newIndex); // Show the new card, not the old currentIndex
        }
        
        print(`ChatExtensions: Added user card ${newIndex} with message: "${message.substring(0, 50)}..."`);
        return true;
      }
      
    } catch (error) {
      print(`ChatExtensions: Error adding user card: ${error}`);
    }
    
    return false;
  }
  
  /**
   * Add a bot message card to the AgenticChat component
   */
  public static addBotCard(agenticChat: ChatComponent, message: string): boolean {
    if (!agenticChat || !message) {
      print("ChatExtensions: ❌ Invalid agenticChat or message");
      return false;
    }
    
    try {
      print(`ChatExtensions: 🤖 Adding bot card: "${message.substring(0, 50)}..."`);
      
      // Access private methods through type assertion
      const chatAny = agenticChat as any;
      
      // Get the next card index
      const newIndex = chatAny.cardData ? chatAny.cardData.length : 0;
      print(`ChatExtensions: 📊 Card index: ${newIndex}`);
      
      // Create card data
      const cardData: CardData = {
        id: newIndex,
        type: CardType.Chatbot,
        textContent: message,
        size: chatAny.cardManager ? chatAny.cardManager.calculateCardSize(message) : { width: 300, height: 100 },
        sceneObject: null
      };
      
      // Instantiate the card using the chatbot card prefab
      if (chatAny.chatbotCardPrefab) {
        print("ChatExtensions: 🏗️ Instantiating bot card prefab");
        const cardObject = chatAny.chatbotCardPrefab.instantiate(agenticChat.getSceneObject());
        cardObject.name = `Card_${newIndex}_Bot`;
        cardData.sceneObject = cardObject;
        cardObject.enabled = false; // Start hidden
        
        // Set up the card content
        if (typeof chatAny.setupCardContent === 'function') {
          print("ChatExtensions: 🔧 Setting up card content");
          chatAny.setupCardContent(cardData);
        }
        
        // Add to arrays
        if (chatAny.cards) {
          chatAny.cards.push(cardObject);
        }
        if (chatAny.cardData) {
          chatAny.cardData.push(cardData);
        }
        
        // 🔥 CRITICAL: Update currentIndex to show the latest cards in chronological order
        chatAny.currentIndex = newIndex;
        
        // Update layout to show the newest card
        if (typeof chatAny.updateCardLayoutToIndex === 'function') {
          print("ChatExtensions: 📐 Updating card layout");
          chatAny.updateCardLayoutToIndex(newIndex); // Show the new card, not the old currentIndex
        }
        
        print(`ChatExtensions: ✅ Added bot card ${newIndex} with message: "${message.substring(0, 50)}..."`);
        return true;
      } else {
        print("ChatExtensions: ❌ No chatbot card prefab found");
      }
      
    } catch (error) {
      print(`ChatExtensions: ❌ Error adding bot card: ${error}`);
    }
    
    return false;
  }
  
  /**
   * Get the total number of cards in the AgenticChat component
   */
  public static getCardCount(agenticChat: ChatComponent): number {
    if (!agenticChat) {
      return 0;
    }
    
    try {
      const chatAny = agenticChat as any;
      return chatAny.cardData ? chatAny.cardData.length : 0;
    } catch (error) {
      print(`ChatExtensions: Error getting card count: ${error}`);
      return 0;
    }
  }
  
  /**
   * Check if the AgenticChat component is ready for adding cards
   */
  public static isReady(agenticChat: ChatComponent): boolean {
    if (!agenticChat) {
      return false;
    }
    
    try {
      const chatAny = agenticChat as any;
      return chatAny.initialized === true && 
             chatAny.userCardPrefab !== null && 
             chatAny.chatbotCardPrefab !== null &&
             chatAny.cardData !== null;
    } catch (error) {
      print(`ChatExtensions: Error checking readiness: ${error}`);
      return false;
    }
  }
  
  /**
   * Clear all cards from the AgenticChat component
   */
  public static clearAllCards(agenticChat: ChatComponent): boolean {
    if (!agenticChat) {
      return false;
    }
    
    try {
      const chatAny = agenticChat as any;
      
      // Destroy all existing card objects
      if (chatAny.cardData && Array.isArray(chatAny.cardData)) {
        for (const cardData of chatAny.cardData) {
          if (cardData.sceneObject) {
            cardData.sceneObject.destroy();
          }
        }
        
        // Clear the card data array
        chatAny.cardData = [];
        
        // Clear the cards array if it exists
        if (chatAny.cards && Array.isArray(chatAny.cards)) {
          chatAny.cards = [];
        }
        
        // Clear animation map to prevent null reference errors
        if (chatAny.animatingCards && chatAny.animatingCards.clear) {
          chatAny.animatingCards.clear();
        }
        
        // Reset the card manager if it exists
        if (chatAny.cardManager) {
          chatAny.cardManager.clearAllCards();
        }
        
        // Reset the current index
        if (chatAny.currentIndex !== undefined) {
          chatAny.currentIndex = 0;
        }
        
        print("ChatExtensions: ✅ All cards cleared successfully");
        return true;
      }
      
    } catch (error) {
      print(`ChatExtensions: ❌ Error clearing cards: ${error}`);
    }
    
    return false;
  }
}
