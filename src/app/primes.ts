/** Counts primes below `limit` by trial division. Deliberately CPU-heavy so the demo can show a blocked UI. */
export function countPrimes(limit: number, onProgress?: (percent: number) => void): number {
  let count = 0;
  let lastPercent = -1;
  for (let n = 2; n < limit; n++) {
    let isPrime = true;
    for (let d = 2; d * d <= n; d++) {
      if (n % d === 0) {
        isPrime = false;
        break;
      }
    }
    if (isPrime) count++;
    const percent = Math.floor((n / limit) * 100);
    if (onProgress && percent !== lastPercent) {
      lastPercent = percent;
      onProgress(percent);
    }
  }
  onProgress?.(100);
  return count;
}
