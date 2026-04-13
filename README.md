# Prime Factorize — 素因数分解ツール

Prime factorization and number theory tool. Runs entirely in the browser with zero dependencies and no build step.

**Live demo**: https://sen.ltd/portfolio/prime-factorize/

## Features

- **Prime factorization** — e.g. 360 = 2³ × 3² × 5
- **All divisors** listed in ascending order
- **Divisor count** σ₀(n) and **sum of divisors** σ(n)
- **Primality test** — deterministic Miller-Rabin for large numbers (up to Number.MAX_SAFE_INTEGER = 2⁵³ − 1)
- **Next prime / previous prime**
- **Euler's totient φ(n)**
- **GCD and LCM** with a second number
- **Perfect / abundant / deficient** number classification
- **Factorization tree** visualization
- **History** of recent calculations (localStorage)
- Japanese / English UI toggle
- Dark / light theme

## Usage

```bash
# Serve locally (no build required)
npm run serve
# Open http://localhost:8080
```

## Run tests

```bash
node --test tests/prime.test.js
# 75 tests, 0 failures
```

## Tech

- Vanilla JS (ES modules), HTML, CSS
- No framework, no build step
- `node:test` built-in runner for tests

## Number range

Supports positive integers up to `Number.MAX_SAFE_INTEGER` (9,007,199,254,740,991 ≈ 9×10¹⁵).
Primality of large numbers uses a deterministic Miller-Rabin test with 12 witnesses, which is proven correct for all integers in this range.

## License

MIT © 2026 SEN LLC (SEN 合同会社)
