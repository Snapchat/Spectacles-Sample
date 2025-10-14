/**
 * Utility for assigning consistent colors to players based on their connectionId.
 * Uses deterministic hashing to ensure the same player gets the same color
 * across all devices and sessions.
 */
export class PlayerColorAssigner {
    
    /**
     * Generate a deterministic color index from a connectionId string
     * @param connectionId - The player's unique connection ID
     * @param totalColors - Total number of available colors/materials
     * @returns Index into the colors/materials array (0 to totalColors-1)
     */
    public static getColorIndexForPlayer(connectionId: string, totalColors: number): number {
        if (totalColors <= 0) {
            print("⚠️ PlayerColorAssigner: totalColors must be > 0");
            return 0;
        }
        
        // Simple hash function for connectionId
        let hash = PlayerColorAssigner.hashString(connectionId);
        
        // Ensure positive number and map to color range
        const colorIndex = Math.abs(hash) % totalColors;
        
        print(`🎨 PlayerColorAssigner: ConnectionId "${connectionId}" → Color Index ${colorIndex}`);
        return colorIndex;
    }
    
    /**
     * Get a color name for debugging/logging purposes
     * @param colorIndex - Index in the color array
     * @returns Human-readable color name
     */
    public static getColorName(colorIndex: number): string {
        const colorNames = [
            "Red", "Blue", "Green", "Yellow", "Purple", "Orange", 
            "Pink", "Cyan", "Magenta", "Lime", "Indigo", "Teal"
        ];
        
        if (colorIndex >= 0 && colorIndex < colorNames.length) {
            return colorNames[colorIndex];
        }
        
        return `Color${colorIndex}`;
    }
    
    /**
     * Simple string hash function (djb2 algorithm)
     * @param str - String to hash
     * @returns Hash value
     */
    private static hashString(str: string): number {
        let hash = 5381;
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) + hash) + str.charCodeAt(i);
        }
        return hash;
    }
    
    /**
     * Validate that we have enough colors for reasonable player counts
     * @param availableColors - Number of colors/materials available
     * @returns Whether the color count is reasonable
     */
    public static validateColorCount(availableColors: number): boolean {
        const RECOMMENDED_MIN_COLORS = 8;
        const RECOMMENDED_MAX_COLORS = 16;
        
        if (availableColors < RECOMMENDED_MIN_COLORS) {
            print(`⚠️ PlayerColorAssigner: Only ${availableColors} colors available. Recommend at least ${RECOMMENDED_MIN_COLORS} for good variety.`);
            return false;
        }
        
        if (availableColors > RECOMMENDED_MAX_COLORS) {
            print(`ℹ️ PlayerColorAssigner: ${availableColors} colors available. More than ${RECOMMENDED_MAX_COLORS} may be excessive.`);
        }
        
        return true;
    }
    
    /**
     * Get all unique player color assignments for current session
     * Useful for debugging or UI displays
     * @param userInfoList - List of connected users
     * @param totalColors - Total available colors
     * @returns Map of connectionId -> colorIndex
     */
    public static getSessionColorAssignments(userInfoList: ConnectedLensModule.UserInfo[], totalColors: number): Map<string, number> {
        const assignments = new Map<string, number>();
        
        userInfoList.forEach(userInfo => {
            const colorIndex = PlayerColorAssigner.getColorIndexForPlayer(userInfo.connectionId, totalColors);
            assignments.set(userInfo.connectionId, colorIndex);
        });
        
        return assignments;
    }
}