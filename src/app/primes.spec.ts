import { countPrimes } from './primes';

describe('countPrimes', () => {
  it('counts the primes below a limit', () => {
    expect(countPrimes(2)).toBe(0);
    expect(countPrimes(10)).toBe(4);
    expect(countPrimes(100_000)).toBe(9592);
  });

  it('reports progress up to 99 percent', () => {
    const progress: number[] = [];
    countPrimes(1000, p => progress.push(p));
    expect(progress[0]).toBe(0);
    expect(progress.at(-1)).toBe(99);
  });
});
