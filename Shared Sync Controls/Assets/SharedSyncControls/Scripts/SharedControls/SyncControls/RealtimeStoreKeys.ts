// Enum to define keys used in the real-time data store for synchronization
export enum RealtimeStoreKeys {
  COLOR_RED = "COLOR_RED", // Key for storing the red component of a color
  COLOR_GREEN = "COLOR_GREEN", // Key for storing the green component of a color
  COLOR_BLUE = "COLOR_BLUE", // Key for storing the blue component of a color
  VALUE = "VALUE" // Key for storing a counter value
}

// Enum to define color parameters
export enum ColorParams {
  x, // Represents the red component index in a color vector
  y, // Represents the green component index in a color vector
  z // Represents the blue component index in a color vector
}
