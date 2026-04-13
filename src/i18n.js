/**
 * i18n.js — Japanese / English UI strings
 */

export const translations = {
  ja: {
    title: '素因数分解',
    subtitle: '数論ツール',
    inputLabel: '整数を入力',
    inputPlaceholder: '例: 360',
    analyze: '分析',
    clear: 'クリア',
    secondLabel: '第2の数（GCD / LCM 用）',
    secondPlaceholder: '例: 24',
    // Result section labels
    factorization: '素因数分解',
    isPrime: '素数？',
    divisors: '約数リスト',
    countDivisors: '約数の個数',
    sumDivisors: '約数の和',
    totient: 'オイラーの φ(n)',
    nextPrime: '次の素数',
    prevPrime: '前の素数',
    gcdLabel: 'GCD',
    lcmLabel: 'LCM',
    isPerfect: '完全数？',
    classification: '分類',
    // Values
    yes: 'はい',
    no: 'いいえ',
    none: 'なし',
    perfect: '完全数',
    abundant: '過剰数',
    deficient: '不足数',
    prime: '素数',
    // Tree
    treeTitle: '因数分解ツリー',
    // History
    historyTitle: '履歴',
    historyEmpty: '計算履歴はありません',
    historyClear: '履歴をクリア',
    // Theme / Lang
    themeToggle: 'テーマ切替',
    langToggle: 'EN',
    // Errors
    errorEmpty: '数値を入力してください',
    errorNotInt: '整数を入力してください',
    errorTooSmall: '1 以上の整数を入力してください',
    errorTooLarge: '9,007,199,254,740,991 以下の整数を入力してください',
    // Info tooltip
    infoMillerRabin: '大きな素数の判定には Miller-Rabin 確率的素数判定法を使用',
    // Number display
    n: 'n',
  },
  en: {
    title: 'Prime Factorize',
    subtitle: 'Number Theory Tool',
    inputLabel: 'Enter an integer',
    inputPlaceholder: 'e.g. 360',
    analyze: 'Analyze',
    clear: 'Clear',
    secondLabel: 'Second number (for GCD / LCM)',
    secondPlaceholder: 'e.g. 24',
    factorization: 'Prime Factorization',
    isPrime: 'Prime?',
    divisors: 'Divisors',
    countDivisors: 'Divisor Count',
    sumDivisors: 'Sum of Divisors',
    totient: "Euler's φ(n)",
    nextPrime: 'Next Prime',
    prevPrime: 'Previous Prime',
    gcdLabel: 'GCD',
    lcmLabel: 'LCM',
    isPerfect: 'Perfect Number?',
    classification: 'Classification',
    yes: 'Yes',
    no: 'No',
    none: 'None',
    perfect: 'Perfect',
    abundant: 'Abundant',
    deficient: 'Deficient',
    prime: 'Prime',
    treeTitle: 'Factorization Tree',
    historyTitle: 'History',
    historyEmpty: 'No calculations yet',
    historyClear: 'Clear History',
    themeToggle: 'Toggle Theme',
    langToggle: '日本語',
    errorEmpty: 'Please enter a number',
    errorNotInt: 'Please enter an integer',
    errorTooSmall: 'Please enter an integer ≥ 1',
    errorTooLarge: 'Please enter an integer ≤ 9,007,199,254,740,991',
    infoMillerRabin: 'Miller-Rabin primality test is used for large numbers',
    n: 'n',
  },
};

export function t(lang, key) {
  return translations[lang]?.[key] ?? translations.en[key] ?? key;
}
