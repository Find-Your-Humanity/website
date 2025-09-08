export function formatNumber(value: number | null | undefined): string {
  const n = typeof value === 'number' && isFinite(value) ? value : 0;
  return new Intl.NumberFormat('ko-KR').format(n);
}

export function formatPercentage(value: number | null | undefined, fractionDigits = 1): string {
  const n = typeof value === 'number' && isFinite(value) ? value : 0;
  return `${n.toFixed(fractionDigits)}%`;
}

export function formatResponseTime(ms: number | null | undefined): string {
  const n = typeof ms === 'number' && isFinite(ms) ? ms : 0;
  if (n < 1000) return `${Math.round(n)} ms`;
  return `${(n / 1000).toFixed(2)} s`;
}
