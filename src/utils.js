export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function formatTokens(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n.toString();
}

export function formatPercentage(value) {
  return (value * 100).toFixed(1) + '%';
}

export function calculateSavings(naiveTokens, resilientTokens) {
  const saved = naiveTokens - resilientTokens;
  const percentage = naiveTokens > 0 ? ((saved / naiveTokens) * 100).toFixed(1) : 0;
  return { saved, percentage };
}

export function calculateAccuracy(results) {
  if (results.length === 0) return 0;
  return results.filter(r => r.success).length / results.length;
}

export function padRight(str, len) {
  return str + ' '.repeat(Math.max(0, len - str.length));
}

export function generateBar(value, maxValue, width = 20, fill = '█', empty = '░') {
  const filled = Math.round((value / maxValue) * width);
  return fill.repeat(filled) + empty.repeat(Math.max(0, width - filled));
}

export function generateComparisonBar(naiveValue, resilientValue, maxValue, width = 20) {
  const naiveFilled = Math.round((naiveValue / maxValue) * width);
  const resilientFilled = Math.round((resilientValue / maxValue) * width);
  const bars = [];
  bars.push(`  ❌ Naive:     ${'█'.repeat(naiveFilled)}${'░'.repeat(Math.max(0, width - naiveFilled))} ${naiveValue}`);
  bars.push(`  ✅ Resilient: ${'█'.repeat(resilientFilled)}${'░'.repeat(Math.max(0, width - resilientFilled))} ${resilientValue}`);
  return bars.join('\n');
}
