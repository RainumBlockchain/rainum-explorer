/**
 * Color Ring Hash (CRH)
 * Generates a unique, vibrant color for a given address
 */
export function getAddressColor(address: string): string {
  // Create a simple hash from the address
  let hash = 0
  for (let i = 0; i < address.length; i++) {
    hash = address.charCodeAt(i) + ((hash << 5) - hash)
    hash = hash & hash // Convert to 32bit integer
  }

  // Generate vibrant HSL color
  const hue = Math.abs(hash % 360)
  const saturation = 65 + (Math.abs(hash) % 20) // 65-85%
  const lightness = 45 + (Math.abs(hash >> 8) % 15) // 45-60%

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`
}

/**
 * Get Tailwind-compatible color classes for rings
 * Returns a style object for inline styling
 */
export function getAddressRingStyle(address: string): { borderColor: string } {
  return {
    borderColor: getAddressColor(address)
  }
}
