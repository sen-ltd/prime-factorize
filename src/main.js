/**
 * main.js — DOM, events, rendering
 */

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
  formatFactorization,
} from './prime.js';

import { t, translations } from './i18n.js';

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

let lang = localStorage.getItem('pf-lang') || 'ja';
let theme = localStorage.getItem('pf-theme') || 'dark';
let history = JSON.parse(localStorage.getItem('pf-history') || '[]');

// ---------------------------------------------------------------------------
// DOM helpers
// ---------------------------------------------------------------------------

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

function applyTheme() {
  document.documentElement.setAttribute('data-theme', theme);
  $('#theme-btn').textContent = theme === 'dark' ? '☀️' : '🌙';
}

function applyLang() {
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      el.placeholder = t(lang, key);
    } else {
      el.textContent = t(lang, key);
    }
  });
  $('#lang-btn').textContent = t(lang, 'langToggle');
  document.documentElement.lang = lang;
}

// ---------------------------------------------------------------------------
// Factorization tree (SVG text-based)
// ---------------------------------------------------------------------------

function buildTreeLines(n, factors, depth = 0) {
  const lines = [];
  if (factors.length === 0) {
    lines.push({ depth, value: n, label: '', isPrime: true });
    return lines;
  }

  lines.push({ depth, value: n, label: '' });

  // Expand by smallest prime factor
  const [p, e] = factors[0];
  const rest = [...factors];
  if (rest[0][1] === 1) {
    rest.shift();
  } else {
    rest[0] = [p, e - 1];
  }
  const quotient = n / p;

  // Left child: prime factor p
  lines.push({ depth: depth + 1, value: p, label: '', isPrime: true, connector: 'left' });
  // Right child: quotient
  if (quotient > 1) {
    const subFactors = rest[0] && rest[0][1] > 0 ? rest : factors.slice(1);
    const subLines = buildTreeLines(quotient, subFactors, depth + 1);
    subLines[0].connector = 'right';
    lines.push(...subLines);
  }
  return lines;
}

function renderTree(n, factors) {
  const container = $('#tree-container');
  if (!container) return;

  if (factors.length === 0 && n === 1) {
    container.innerHTML = `<div class="tree-text">1 = 1</div>`;
    return;
  }

  // Build a simple hierarchical text tree
  const lines = buildFactorTree(n, factors);
  container.innerHTML = `<pre class="tree-text">${lines}</pre>`;
}

function buildFactorTree(n, factors) {
  // Convert factorization to a readable tree representation
  if (factors.length === 0) return String(n);

  const lines = [];

  function addNode(num, remainingFactors, prefix, isLast) {
    const marker = isLast ? '└─ ' : '├─ ';
    const [p] = remainingFactors[0];

    lines.push(`${prefix}${marker}${num}`);

    if (remainingFactors.length === 0) return;

    const childPrefix = prefix + (isLast ? '   ' : '│  ');

    // Split: prime p and quotient num/p
    const quotient = num / p;
    const newFactors = [...remainingFactors];
    if (newFactors[0][1] === 1) {
      newFactors.shift();
    } else {
      newFactors[0] = [p, newFactors[0][1] - 1];
    }

    // Left child: p (prime, leaf)
    lines.push(`${childPrefix}├─ ${p} ✦`);
    // Right child: quotient
    if (quotient > 1) {
      if (newFactors.length === 0) {
        lines.push(`${childPrefix}└─ ${quotient} ✦`);
      } else {
        addNode(quotient, newFactors, childPrefix, true);
      }
    }
  }

  lines.push(String(n));
  // Expand recursively
  function expandTree(num, remainingFactors, indent) {
    if (remainingFactors.length === 0) return;
    const [p] = remainingFactors[0];
    const quotient = num / p;
    const newFactors = [...remainingFactors];
    if (newFactors[0][1] === 1) {
      newFactors.shift();
    } else {
      newFactors[0] = [p, newFactors[0][1] - 1];
    }

    const lastRight = newFactors.length === 0;
    lines.push(`${indent}├─ ${p} ✦`);
    if (quotient > 1) {
      const mark = lastRight ? '└─ ' : '├─ ';
      if (newFactors.length === 0) {
        lines.push(`${indent}${mark}${quotient} ✦`);
      } else {
        lines.push(`${indent}${mark}${quotient}`);
        expandTree(quotient, newFactors, indent + '   ');
      }
    }
  }
  expandTree(n, factors, '');

  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Result rendering
// ---------------------------------------------------------------------------

function renderResults(n, n2) {
  const factors = factorize(n);
  const divs = divisors(n);
  const dc = countDivisors(n);
  const sd = sumOfDivisors(n);
  const prime = isPrime(n);
  const np = nextPrime(n);
  const pp = prevPrime(n);
  const phi = totient(n);
  const perfect = isPerfect(n);
  const abundant = isAbundant(n);
  const deficient = isDeficient(n);

  const factStr = factors.length === 0 ? '1' : `${n} = ${formatFactorization(factors)}`;

  // Classification
  let classLabel, classClass;
  if (prime) {
    classLabel = t(lang, 'prime');
    classClass = 'tag-prime';
  } else if (perfect) {
    classLabel = t(lang, 'perfect');
    classClass = 'tag-perfect';
  } else if (abundant) {
    classLabel = t(lang, 'abundant');
    classClass = 'tag-abundant';
  } else {
    classLabel = t(lang, 'deficient');
    classClass = 'tag-deficient';
  }

  // Divisors display (limit to 60)
  const divDisplay =
    divs.length <= 60
      ? divs.join(', ')
      : divs.slice(0, 60).join(', ') + ` … (+${divs.length - 60})`;

  // GCD / LCM
  let gcdVal = '—';
  let lcmVal = '—';
  if (n2 !== null) {
    gcdVal = gcd(n, n2).toLocaleString();
    const l = lcm(n, n2);
    lcmVal = l > Number.MAX_SAFE_INTEGER ? '∞ (overflow)' : l.toLocaleString();
  }

  const grid = $('#result-grid');
  grid.innerHTML = '';

  const rows = [
    {
      label: t(lang, 'factorization'),
      value: factStr,
      cls: 'mono factorization-value',
      wide: true,
    },
    {
      label: t(lang, 'isPrime'),
      value: prime ? `✓ ${t(lang, 'yes')}` : `✗ ${t(lang, 'no')}`,
      cls: prime ? 'value-yes' : 'value-no',
    },
    { label: t(lang, 'classification'), value: classLabel, cls: classClass },
    { label: `${t(lang, 'countDivisors')} (σ₀)`, value: dc.toLocaleString(), cls: 'mono' },
    { label: `${t(lang, 'sumDivisors')} (σ)`, value: sd.toLocaleString(), cls: 'mono' },
    { label: `${t(lang, 'totient')} φ(n)`, value: phi.toLocaleString(), cls: 'mono' },
    { label: t(lang, 'nextPrime'), value: np.toLocaleString(), cls: 'mono' },
    {
      label: t(lang, 'prevPrime'),
      value: pp !== null ? pp.toLocaleString() : t(lang, 'none'),
      cls: 'mono',
    },
    { label: t(lang, 'isPerfect'), value: perfect ? `✓ ${t(lang, 'yes')}` : `✗ ${t(lang, 'no')}`, cls: perfect ? 'value-yes' : '' },
    { label: `${t(lang, 'gcdLabel')} (n, m)`, value: gcdVal, cls: 'mono' },
    { label: `${t(lang, 'lcmLabel')} (n, m)`, value: lcmVal, cls: 'mono' },
    { label: `${t(lang, 'divisors')} (${dc})`, value: divDisplay, cls: 'mono divisors-value', wide: true },
  ];

  for (const row of rows) {
    const card = document.createElement('div');
    card.className = `result-card${row.wide ? ' result-card--wide' : ''}`;
    card.innerHTML = `
      <div class="result-label">${row.label}</div>
      <div class="result-value ${row.cls || ''}">${row.value}</div>
    `;
    grid.appendChild(card);
  }

  // Tree
  renderTree(n, factors);

  // Show results section
  $('#results').hidden = false;
}

// ---------------------------------------------------------------------------
// History
// ---------------------------------------------------------------------------

function saveHistory(n) {
  history = [n, ...history.filter((x) => x !== n)].slice(0, 20);
  localStorage.setItem('pf-history', JSON.stringify(history));
  renderHistory();
}

function renderHistory() {
  const list = $('#history-list');
  if (!list) return;
  if (history.length === 0) {
    list.innerHTML = `<li class="history-empty">${t(lang, 'historyEmpty')}</li>`;
    return;
  }
  list.innerHTML = history
    .map(
      (n) =>
        `<li><button class="history-item" data-n="${n}">${n.toLocaleString()}</button></li>`
    )
    .join('');
  list.querySelectorAll('.history-item').forEach((btn) => {
    btn.addEventListener('click', () => {
      $('#input-n').value = btn.dataset.n;
      runAnalysis();
    });
  });
}

// ---------------------------------------------------------------------------
// Input validation & analysis
// ---------------------------------------------------------------------------

function showError(msg) {
  const err = $('#error-msg');
  err.textContent = msg;
  err.hidden = false;
  $('#results').hidden = true;
}

function clearError() {
  const err = $('#error-msg');
  err.textContent = '';
  err.hidden = true;
}

function runAnalysis() {
  clearError();
  const raw = $('#input-n').value.trim().replace(/,/g, '');
  if (!raw) {
    showError(t(lang, 'errorEmpty'));
    return;
  }

  const n = Number(raw);
  if (!Number.isInteger(n)) {
    showError(t(lang, 'errorNotInt'));
    return;
  }
  if (n < 1) {
    showError(t(lang, 'errorTooSmall'));
    return;
  }
  if (n > Number.MAX_SAFE_INTEGER) {
    showError(t(lang, 'errorTooLarge'));
    return;
  }

  const raw2 = $('#input-n2').value.trim().replace(/,/g, '');
  let n2 = null;
  if (raw2) {
    const v2 = Number(raw2);
    if (Number.isInteger(v2) && v2 >= 1 && v2 <= Number.MAX_SAFE_INTEGER) {
      n2 = v2;
    }
  }

  renderResults(n, n2);
  saveHistory(n);
}

// ---------------------------------------------------------------------------
// Init
// ---------------------------------------------------------------------------

function init() {
  applyTheme();
  applyLang();
  renderHistory();

  // Analyze button
  $('#analyze-btn').addEventListener('click', runAnalysis);

  // Enter key on inputs
  ['#input-n', '#input-n2'].forEach((sel) => {
    $(sel).addEventListener('keydown', (e) => {
      if (e.key === 'Enter') runAnalysis();
    });
  });

  // Clear
  $('#clear-btn').addEventListener('click', () => {
    $('#input-n').value = '';
    $('#input-n2').value = '';
    $('#results').hidden = true;
    clearError();
  });

  // Theme toggle
  $('#theme-btn').addEventListener('click', () => {
    theme = theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('pf-theme', theme);
    applyTheme();
  });

  // Lang toggle
  $('#lang-btn').addEventListener('click', () => {
    lang = lang === 'ja' ? 'en' : 'ja';
    localStorage.setItem('pf-lang', lang);
    applyLang();
    renderHistory();
    // Re-render results if visible
    if (!$('#results').hidden) {
      const raw = $('#input-n').value.trim();
      if (raw) runAnalysis();
    }
  });

  // History clear
  $('#history-clear-btn').addEventListener('click', () => {
    history = [];
    localStorage.removeItem('pf-history');
    renderHistory();
  });

  // Example numbers
  $$('.example-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      $('#input-n').value = btn.dataset.n;
      if (btn.dataset.m) {
        $('#input-n2').value = btn.dataset.m;
      }
      runAnalysis();
    });
  });
}

document.addEventListener('DOMContentLoaded', init);
