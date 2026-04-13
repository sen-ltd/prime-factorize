/**
 * prime.test.js — unit tests for prime.js
 * Run: node --test tests/prime.test.js
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  factorize,
  divisors,
  countDivisors,
  sumOfDivisors,
  isPrime,
  nextPrime,
  prevPrime,
  totient,
  gcd,
  lcm,
  isPerfect,
  isAbundant,
  isDeficient,
  primesUpTo,
  formatFactorization,
} from '../src/prime.js';

// ---------------------------------------------------------------------------
// factorize
// ---------------------------------------------------------------------------
describe('factorize', () => {
  it('factorize(1) returns []', () => {
    assert.deepEqual(factorize(1), []);
  });

  it('factorize(2) returns [[2,1]]', () => {
    assert.deepEqual(factorize(2), [[2, 1]]);
  });

  it('factorize(prime 97) returns [[97,1]]', () => {
    assert.deepEqual(factorize(97), [[97, 1]]);
  });

  it('factorize(360) = 2³×3²×5', () => {
    assert.deepEqual(factorize(360), [[2, 3], [3, 2], [5, 1]]);
  });

  it('factorize(12) = 2²×3', () => {
    assert.deepEqual(factorize(12), [[2, 2], [3, 1]]);
  });

  it('factorize(1024) = 2¹⁰', () => {
    assert.deepEqual(factorize(1024), [[2, 10]]);
  });

  it('factorize(2 * 3 * 5 * 7 * 11) = five distinct primes', () => {
    assert.deepEqual(factorize(2310), [[2, 1], [3, 1], [5, 1], [7, 1], [11, 1]]);
  });

  it('factorize(large prime 999983)', () => {
    assert.deepEqual(factorize(999983), [[999983, 1]]);
  });

  it('factorize(1000000) = 2⁶×5⁶', () => {
    assert.deepEqual(factorize(1_000_000), [[2, 6], [5, 6]]);
  });

  it('throws for n=0', () => {
    assert.throws(() => factorize(0), RangeError);
  });

  it('throws for negative n', () => {
    assert.throws(() => factorize(-5), RangeError);
  });
});

// ---------------------------------------------------------------------------
// divisors
// ---------------------------------------------------------------------------
describe('divisors', () => {
  it('divisors(1) = [1]', () => {
    assert.deepEqual(divisors(1), [1]);
  });

  it('divisors(12) = [1,2,3,4,6,12]', () => {
    assert.deepEqual(divisors(12), [1, 2, 3, 4, 6, 12]);
  });

  it('divisors(prime 7) = [1,7]', () => {
    assert.deepEqual(divisors(7), [1, 7]);
  });

  it('divisors(36) has 9 elements', () => {
    assert.equal(divisors(36).length, 9);
  });
});

// ---------------------------------------------------------------------------
// countDivisors
// ---------------------------------------------------------------------------
describe('countDivisors', () => {
  it('countDivisors(1) = 1', () => {
    assert.equal(countDivisors(1), 1);
  });

  it('countDivisors(prime 13) = 2', () => {
    assert.equal(countDivisors(13), 2);
  });

  it('countDivisors(12) = 6', () => {
    assert.equal(countDivisors(12), 6);
  });

  it('countDivisors(360) = 24', () => {
    assert.equal(countDivisors(360), 24);
  });
});

// ---------------------------------------------------------------------------
// sumOfDivisors
// ---------------------------------------------------------------------------
describe('sumOfDivisors', () => {
  it('sumOfDivisors(1) = 1', () => {
    assert.equal(sumOfDivisors(1), 1);
  });

  it('sumOfDivisors(6) = 12 (perfect)', () => {
    assert.equal(sumOfDivisors(6), 12);
  });

  it('sumOfDivisors(12) = 28', () => {
    assert.equal(sumOfDivisors(12), 28);
  });

  it('sumOfDivisors(prime 7) = 8', () => {
    assert.equal(sumOfDivisors(7), 8);
  });
});

// ---------------------------------------------------------------------------
// isPrime
// ---------------------------------------------------------------------------
describe('isPrime', () => {
  it('isPrime(1) = false', () => {
    assert.equal(isPrime(1), false);
  });

  it('isPrime(2) = true', () => {
    assert.equal(isPrime(2), true);
  });

  it('isPrime(3) = true', () => {
    assert.equal(isPrime(3), true);
  });

  it('isPrime(4) = false', () => {
    assert.equal(isPrime(4), false);
  });

  it('isPrime(17) = true', () => {
    assert.equal(isPrime(17), true);
  });

  it('isPrime(25) = false', () => {
    assert.equal(isPrime(25), false);
  });

  it('isPrime(97) = true', () => {
    assert.equal(isPrime(97), true);
  });

  it('isPrime(100) = false', () => {
    assert.equal(isPrime(100), false);
  });

  it('isPrime(large: 999999937) = true', () => {
    assert.equal(isPrime(999999937), true);
  });

  it('isPrime(large: 999999938) = false', () => {
    assert.equal(isPrime(999999938), false);
  });

  it('isPrime(0) = false', () => {
    assert.equal(isPrime(0), false);
  });

  it('isPrime(-7) = false', () => {
    assert.equal(isPrime(-7), false);
  });
});

// ---------------------------------------------------------------------------
// nextPrime / prevPrime
// ---------------------------------------------------------------------------
describe('nextPrime', () => {
  it('nextPrime(1) = 2', () => {
    assert.equal(nextPrime(1), 2);
  });

  it('nextPrime(2) = 3', () => {
    assert.equal(nextPrime(2), 3);
  });

  it('nextPrime(10) = 11', () => {
    assert.equal(nextPrime(10), 11);
  });

  it('nextPrime(100) = 101', () => {
    assert.equal(nextPrime(100), 101);
  });
});

describe('prevPrime', () => {
  it('prevPrime(2) = null', () => {
    assert.equal(prevPrime(2), null);
  });

  it('prevPrime(3) = 2', () => {
    assert.equal(prevPrime(3), 2);
  });

  it('prevPrime(10) = 7', () => {
    assert.equal(prevPrime(10), 7);
  });

  it('prevPrime(11) = 7', () => {
    assert.equal(prevPrime(11), 7);
  });
});

// ---------------------------------------------------------------------------
// totient
// ---------------------------------------------------------------------------
describe('totient', () => {
  it('totient(1) = 1', () => {
    assert.equal(totient(1), 1);
  });

  it('totient(prime 7) = 6', () => {
    assert.equal(totient(7), 6);
  });

  it('totient(12) = 4', () => {
    assert.equal(totient(12), 4);
  });

  it('totient(36) = 12', () => {
    assert.equal(totient(36), 12);
  });

  it('totient(100) = 40', () => {
    assert.equal(totient(100), 40);
  });
});

// ---------------------------------------------------------------------------
// gcd / lcm
// ---------------------------------------------------------------------------
describe('gcd', () => {
  it('gcd(12, 8) = 4', () => {
    assert.equal(gcd(12, 8), 4);
  });

  it('gcd(7, 13) = 1 (coprime)', () => {
    assert.equal(gcd(7, 13), 1);
  });

  it('gcd(0, 5) = 5', () => {
    assert.equal(gcd(0, 5), 5);
  });

  it('gcd(100, 75) = 25', () => {
    assert.equal(gcd(100, 75), 25);
  });
});

describe('lcm', () => {
  it('lcm(4, 6) = 12', () => {
    assert.equal(lcm(4, 6), 12);
  });

  it('lcm(7, 13) = 91', () => {
    assert.equal(lcm(7, 13), 91);
  });

  it('lcm(0, 5) = 0', () => {
    assert.equal(lcm(0, 5), 0);
  });
});

// ---------------------------------------------------------------------------
// isPerfect / isAbundant / isDeficient
// ---------------------------------------------------------------------------
describe('isPerfect', () => {
  it('isPerfect(6) = true', () => {
    assert.equal(isPerfect(6), true);
  });

  it('isPerfect(28) = true', () => {
    assert.equal(isPerfect(28), true);
  });

  it('isPerfect(496) = true', () => {
    assert.equal(isPerfect(496), true);
  });

  it('isPerfect(8128) = true', () => {
    assert.equal(isPerfect(8128), true);
  });

  it('isPerfect(12) = false', () => {
    assert.equal(isPerfect(12), false);
  });

  it('isPerfect(1) = false', () => {
    assert.equal(isPerfect(1), false);
  });
});

describe('isAbundant', () => {
  it('isAbundant(12) = true', () => {
    assert.equal(isAbundant(12), true);
  });

  it('isAbundant(6) = false (perfect)', () => {
    assert.equal(isAbundant(6), false);
  });

  it('isAbundant(7) = false (prime/deficient)', () => {
    assert.equal(isAbundant(7), false);
  });
});

describe('isDeficient', () => {
  it('isDeficient(prime 7) = true', () => {
    assert.equal(isDeficient(7), true);
  });

  it('isDeficient(6) = false (perfect)', () => {
    assert.equal(isDeficient(6), false);
  });

  it('isDeficient(12) = false (abundant)', () => {
    assert.equal(isDeficient(12), false);
  });
});

// ---------------------------------------------------------------------------
// primesUpTo
// ---------------------------------------------------------------------------
describe('primesUpTo', () => {
  it('primesUpTo(1) = []', () => {
    assert.deepEqual(primesUpTo(1), []);
  });

  it('primesUpTo(2) = [2]', () => {
    assert.deepEqual(primesUpTo(2), [2]);
  });

  it('primesUpTo(30) = [2,3,5,7,11,13,17,19,23,29]', () => {
    assert.deepEqual(primesUpTo(30), [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]);
  });

  it('primesUpTo(100) has 25 primes', () => {
    assert.equal(primesUpTo(100).length, 25);
  });
});

// ---------------------------------------------------------------------------
// formatFactorization
// ---------------------------------------------------------------------------
describe('formatFactorization', () => {
  it('formatFactorization([]) = "1"', () => {
    assert.equal(formatFactorization([]), '1');
  });

  it('formatFactorization([[2,1]]) = "2"', () => {
    assert.equal(formatFactorization([[2, 1]]), '2');
  });

  it('formatFactorization of 360 factors', () => {
    assert.equal(formatFactorization([[2, 3], [3, 2], [5, 1]]), '2³ × 3² × 5');
  });

  it('formatFactorization([[2,10]]) = "2¹⁰"', () => {
    assert.equal(formatFactorization([[2, 10]]), '2¹⁰');
  });
});
