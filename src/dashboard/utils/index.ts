export function formatNumber(value: number | null | undefined): string {
  const n = typeof value === 'number' && isFinite(value) ? value : 0;
  return new Intl.NumberFormat('ko-KR').format(n);
}

export function formatPercentage(value: number | null | undefined, fractionDigits = 1): string {
  const n = typeof value === 'number' && isFinite(value) ? value : 0;
  // 100%를 넘는 경우 100%로 제한
  const clampedValue = Math.min(n, 100);
  return `${clampedValue.toFixed(fractionDigits)}%`;
}

export function formatResponseTime(ms: number | null | undefined): string {
  const n = typeof ms === 'number' && isFinite(ms) ? ms : 0;
  if (n < 1000) return `${Math.round(n)} ms`;
  return `${(n / 1000).toFixed(2)} s`;
}
