/**
 * Formats a currency amount into Pakistani Rupees (PKR)
 * Example: formatPKR(2499) -> "Rs. 2,499"
 * Example: formatPKR(485500) -> "Rs. 485,500"
 */
export function formatPKR(amount: number | undefined | null, symbol: string = 'Rs.'): string {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return `${symbol} 0`;
  }
  return `${symbol} ${Math.round(amount).toLocaleString('en-PK')}`;
}
