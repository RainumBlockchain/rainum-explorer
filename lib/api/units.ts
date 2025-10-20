/**
 * Rainum Blockchain Unit Conversions
 *
 * Micro-RAIN system (similar to Ethereum's Wei)
 * 1 RAIN = 1,000,000 micro-RAIN (10^6)
 */

/** Number of micro-RAIN per 1 RAIN token */
export const MICRO_RAIN_PER_RAIN = 1_000_000;

/**
 * Convert RAIN to micro-RAIN
 *
 * @param rain - Amount in RAIN (can have decimals like 0.5 or 0.001)
 * @returns Amount in micro-RAIN as integer
 *
 * @example
 * rainToMicro(1.0)      // 1_000_000 micro-RAIN
 * rainToMicro(0.5)      // 500_000 micro-RAIN
 * rainToMicro(0.001)    // 1_000 micro-RAIN
 */
export function rainToMicro(rain: number): number {
  return Math.round(rain * MICRO_RAIN_PER_RAIN);
}

/**
 * Convert micro-RAIN to RAIN
 *
 * @param micro - Amount in micro-RAIN (integer)
 * @returns Amount in RAIN (with up to 6 decimals)
 *
 * @example
 * microToRain(1_000_000)  // 1.0 RAIN
 * microToRain(500_000)    // 0.5 RAIN
 * microToRain(1_000)      // 0.001 RAIN
 */
export function microToRain(micro: number): number {
  return micro / MICRO_RAIN_PER_RAIN;
}

/**
 * Format micro-RAIN amount for display as RAIN
 *
 * @param micro - Amount in micro-RAIN
 * @param decimals - Number of decimal places to show (default: 6)
 * @returns Formatted string with RAIN suffix
 *
 * @example
 * formatMicroToRain(1_000_000)     // "1.000000 RAIN"
 * formatMicroToRain(500_000, 2)    // "0.50 RAIN"
 * formatMicroToRain(1_234_567, 3)  // "1.235 RAIN"
 */
export function formatMicroToRain(micro: number, decimals: number = 6): string {
  const rain = microToRain(micro);
  return `${rain.toFixed(decimals)} RAIN`;
}
