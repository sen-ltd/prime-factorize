/**
 * prime.js — Number theory functions
 *
 * All functions operate on non-negative safe integers (≤ Number.MAX_SAFE_INTEGER).
 * Internally we use BigInt for Miller-Rabin primality testing of large numbers
 * but expose a regular-number API.
 */

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Modular exponentiation for BigInt: base^exp mod mod
 * @param {bigint} base
 * @param {bigint} exp
 * @param {bigint} mod
 * @returns {bigint}
 */
function modpow(base, exp, mod) {
  let result = 1n;
  base = base % mod;
  while (exp > 0n) {
    if (exp % 2n === 1n) result = (result * base) % mod;
    exp = exp / 2n;
    base = (base * base) % mod;
  }
  return result;
}

/**
 * Deterministic Miller-Rabin primality test.
 * Uses witness set that is correct for all n < 3,317,044,064,679,887,385,961,981
 * which covers all 53-bit safe integers.
 * @param {number} n
 * @returns {boolean}
 */
function millerRabin(n) {
  if (n < 2) return false;
  if (n === 2 || n === 3 || n === 5 || n === 7) return true;
  if (n % 2 === 0) return false;

  const N = BigInt(n);
  // Write n-1 as 2^r * d
  let r = 0n;
  let d = N - 1n;
  while (d % 2n === 0n) {
    d /= 2n;
    r += 1n;
  }

  // Witnesses sufficient for n < 3,215,031,751 (32-bit) use [2,3,5,7]
  // For n up to 3,317,044,064,679,887,385,961,981 use these 12 witnesses
  const witnesses = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37];

  for (const a of witnesses) {
    if (a >= n) continue;
    const A = BigInt(a);
    let x = modpow(A, d, N);
    if (x === 1n || x === N - 1n) continue;
    let composite = true;
    for (let i = 0n; i < r - 1n; i++) {
      x = (x * x) % N;
      if (x === N - 1n) {
        composite = false;
        break;
      }
    }
    if (composite) return false;
  }
  return true;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Test whether n is prime.
 * Uses trial division for n < 1,000,000; Miller-Rabin for larger values.
 * @param {number} n
 * @returns {boolean}
 */
export function isPrime(n) {
  if (!Number.isInteger(n) || n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  if (n === 3) return true;
  if (n % 3 === 0) return false;
  if (n < 1_000_000) {
    for (let i = 5; i * i <= n; i += 6) {
      if (n % i === 0 || n % (i + 2) === 0) return false;
    }
    return true;
  }
  return millerRabin(n);
}

/**
 * Compute the prime factorization of n.
 * @param {number} n — positive integer ≥ 1
 * @returns {Array<[number, number]>} sorted array of [prime, exponent] pairs
 */
export function factorize(n) {
  if (!Number.isInteger(n) || n < 1) throw new RangeError('n must be a positive integer');
  if (n === 1) return [];

  const factors = [];
  let remaining = n;

  // Trial division for small primes
  const smallPrimes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];
  for (const p of smallPrimes) {
    if (p * p > remaining) break;
    if (remaining % p === 0) {
      let exp = 0;
      while (remaining % p === 0) {
        exp++;
        remaining = Math.floor(remaining / p);
      }
      factors.push([p, exp]);
    }
  }

  if (remaining > 1) {
    // Continue trial division from 53 with step 6
    let i = 53;
    while (i * i <= remaining) {
      for (const offset of [0, 4, 6, 10, 12, 16, 22, 24]) {
        const p = i + offset;
        if (p * p > remaining) break;
        if (remaining % p === 0) {
          let exp = 0;
          while (remaining % p === 0) {
            exp++;
            remaining = Math.floor(remaining / p);
          }
          factors.push([p, exp]);
        }
      }
      i += 30;
    }
  }

  if (remaining > 1) {
    factors.push([remaining, 1]);
  }

  factors.sort((a, b) => a[0] - b[0]);
  return factors;
}

/**
 * Return all divisors of n in ascending order.
 * @param {number} n — positive integer
 * @returns {number[]}
 */
export function divisors(n) {
  if (!Number.isInteger(n) || n < 1) throw new RangeError('n must be a positive integer');
  const result = [];
  const sq = Math.sqrt(n);
  for (let i = 1; i <= sq; i++) {
    if (n % i === 0) {
      result.push(i);
      if (i !== n / i) result.push(n / i);
    }
  }
  return result.sort((a, b) => a - b);
}

/**
 * Count the number of divisors of n.
 * Uses the formula: if n = p1^a1 * p2^a2 ... then σ0(n) = (a1+1)(a2+1)...
 * @param {number} n
 * @returns {number}
 */
export function countDivisors(n) {
  if (!Number.isInteger(n) || n < 1) throw new RangeError('n must be a positive integer');
  if (n === 1) return 1;
  const f = factorize(n);
  return f.reduce((acc, [, exp]) => acc * (exp + 1), 1);
}

/**
 * Compute the sum of all divisors of n (σ function).
 * @param {number} n
 * @returns {number}
 */
export function sumOfDivisors(n) {
  if (!Number.isInteger(n) || n < 1) throw new RangeError('n must be a positive integer');
  if (n === 1) return 1;
  const f = factorize(n);
  // σ(n) = ∏ (p^(e+1) - 1) / (p - 1)
  return f.reduce((acc, [p, e]) => {
    let term = 0;
    let pk = 1;
    for (let k = 0; k <= e; k++) {
      term += pk;
      pk *= p;
    }
    return acc * term;
  }, 1);
}

/**
 * Find the next prime strictly greater than n.
 * @param {number} n
 * @returns {number}
 */
export function nextPrime(n) {
  if (!Number.isInteger(n)) throw new TypeError('n must be an integer');
  let candidate = Math.max(2, Math.floor(n) + 1);
  while (!isPrime(candidate)) candidate++;
  return candidate;
}

/**
 * Find the largest prime strictly less than n.
 * Returns null if n ≤ 2.
 * @param {number} n
 * @returns {number|null}
 */
export function prevPrime(n) {
  if (!Number.isInteger(n)) throw new TypeError('n must be an integer');
  let candidate = Math.floor(n) - 1;
  while (candidate >= 2) {
    if (isPrime(candidate)) return candidate;
    candidate--;
  }
  return null;
}

/**
 * Compute Euler's totient φ(n): count of integers in [1, n] coprime to n.
 * @param {number} n — positive integer
 * @returns {number}
 */
export function totient(n) {
  if (!Number.isInteger(n) || n < 1) throw new RangeError('n must be a positive integer');
  if (n === 1) return 1;
  const f = factorize(n);
  // φ(n) = n * ∏ (1 - 1/p)
  let result = n;
  for (const [p] of f) {
    result = result / p * (p - 1);
  }
  return Math.round(result);
}

/**
 * Compute the Greatest Common Divisor of a and b.
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
export function gcd(a, b) {
  a = Math.abs(Math.floor(a));
  b = Math.abs(Math.floor(b));
  while (b !== 0) {
    [a, b] = [b, a % b];
  }
  return a;
}

/**
 * Compute the Least Common Multiple of a and b.
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
export function lcm(a, b) {
  if (a === 0 || b === 0) return 0;
  return Math.abs(a) / gcd(a, b) * Math.abs(b);
}

/**
 * Test whether n is a perfect number (sum of proper divisors equals n).
 * @param {number} n
 * @returns {boolean}
 */
export function isPerfect(n) {
  if (!Number.isInteger(n) || n < 2) return false;
  return sumOfDivisors(n) === 2 * n;
}

/**
 * Test whether n is an abundant number (sum of proper divisors > n).
 * @param {number} n
 * @returns {boolean}
 */
export function isAbundant(n) {
  if (!Number.isInteger(n) || n < 1) return false;
  return sumOfDivisors(n) > 2 * n;
}

/**
 * Test whether n is a deficient number (sum of proper divisors < n).
 * @param {number} n
 * @returns {boolean}
 */
export function isDeficient(n) {
  if (!Number.isInteger(n) || n < 1) return false;
  return sumOfDivisors(n) < 2 * n;
}

/**
 * Generate all primes up to n using the Sieve of Eratosthenes.
 * @param {number} n
 * @returns {number[]}
 */
export function primesUpTo(n) {
  if (!Number.isInteger(n) || n < 2) return [];
  const sieve = new Uint8Array(n + 1).fill(1);
  sieve[0] = 0;
  sieve[1] = 0;
  for (let i = 2; i * i <= n; i++) {
    if (sieve[i]) {
      for (let j = i * i; j <= n; j += i) sieve[j] = 0;
    }
  }
  const primes = [];
  for (let i = 2; i <= n; i++) {
    if (sieve[i]) primes.push(i);
  }
  return primes;
}

/**
 * Format a factorization as a human-readable string, e.g. "2³ × 3² × 5".
 * @param {Array<[number, number]>} factors
 * @returns {string}
 */
export function formatFactorization(factors) {
  if (factors.length === 0) return '1';
  const sup = ['⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹'];
  return factors
    .map(([p, e]) => {
      if (e === 1) return String(p);
      const expStr = String(e)
        .split('')
        .map((d) => sup[parseInt(d)] ?? d)
        .join('');
      return `${p}${expStr}`;
    })
    .join(' × ');
}
