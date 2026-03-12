// 常用工具函数

export function formatAddress(address: string, chars: number = 8): string {
  if (!address) return '';
  if (address.length <= chars * 2) return address;
  return `${address.substring(0, chars)}...${address.substring(address.length - chars)}`;
}

export function formatSOL(amount: number | string): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return num.toFixed(4);
}

export function parseAmount(amount: string): number {
  // 支持 1 SOL 或 1000000000 lamport
  if (amount.includes('.') || amount.length < 10) {
    return parseFloat(amount);
  }
  // 假设是 lamport
  return parseFloat(amount) / 1e9;
}

export async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.substring(0, length - 3) + '...';
}

export const SOL_MINT = 'So11111111111111111111111111111111111111112';
export const USDC_MINT = 'EPjFWdd5AufqSSCwM1X5RUor4S6veMA2FVFkGPz8Srtv';

export const POPULAR_TOKENS = {
  SOL: SOL_MINT,
  USDC: USDC_MINT,
  USDT: 'Es9vMFrzaCERmJfrF4H2FY4WDGWEmNPG9XFvJQVwc1eu',
  BONK: 'DezXAZ8z7PnrnzNTT1t5uT9M9hJ9v6r2vE4v5y8v2Fz',
  WIF: '85VBFQZC9TZkfaptBWqv14ALD9fJNUKtWA41kh69teRP',
  JUP: 'JUPyiwrYJFskUPiHa7hkeR8VUtkqjberbSOWd91pbT',
  RAY: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkkqdRSVD4oNXBiLVxm',
};
