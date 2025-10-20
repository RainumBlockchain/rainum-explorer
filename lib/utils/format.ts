export function formatHash(hash: string | undefined | null, startChars: number = 6, endChars: number = 4): string {
  if (!hash) return 'N/A';
  if (hash.length <= startChars + endChars) return hash;
  return hash.slice(0, startChars) + '...' + hash.slice(-endChars);
}

export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleString();
}

export function formatTimeAgo(timestamp: number): string {
  const now = Date.now();
  const secondsAgo = Math.floor((now - timestamp * 1000) / 1000);
  
  if (secondsAgo < 60) return secondsAgo + 's ago';
  if (secondsAgo < 3600) return Math.floor(secondsAgo / 60) + 'm ago';
  if (secondsAgo < 86400) return Math.floor(secondsAgo / 3600) + 'h ago';
  return Math.floor(secondsAgo / 86400) + 'd ago';
}

/**
 * Format numbers with US locale (e.g., 10,000,000)
 * RAIN tokens are whole numbers only (no decimals)
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}
