/**
 * Describes a hand type, can be left or right
 */
export const AllHandTypes = ["left", "right"] as const
export type HandType = typeof AllHandTypes[number]
