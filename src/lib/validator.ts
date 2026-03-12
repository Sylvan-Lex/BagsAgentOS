// 输入验证模块

export function isValidAddress(address: string): boolean {
  // Base58 检查 (Solana 地址)
  const base58Regex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
  return base58Regex.test(address);
}

export function isValidMint(mint: string): boolean {
  return isValidAddress(mint);
}

export function isValidAmount(amount: string): boolean {
  const num = parseFloat(amount);
  return !isNaN(num) && num > 0;
}

export function isValidTokenSymbol(symbol: string): boolean {
  return /^[A-Z]{1,10}$/.test(symbol.toUpperCase());
}

export function isValidTokenName(name: string): boolean {
  return name.length > 0 && name.length <= 32;
}

export function isValidURI(uri: string): boolean {
  try {
    new URL(uri);
    return true;
  } catch {
    return false;
  }
}

// 验证结果
export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateLaunchToken(
  name: string, 
  symbol: string, 
  supply?: string
): ValidationResult {
  const errors: string[] = [];

  if (!isValidTokenName(name)) {
    errors.push('Invalid token name');
  }

  if (!isValidTokenSymbol(symbol)) {
    errors.push('Invalid token symbol (1-10 uppercase letters)');
  }

  if (supply && !isValidAmount(supply)) {
    errors.push('Invalid supply amount');
  }

  return { valid: errors.length === 0, errors };
}

export function validateSwap(
  fromMint: string,
  toMint: string,
  amount: string
): ValidationResult {
  const errors: string[] = [];

  if (!isValidMint(fromMint)) {
    errors.push('Invalid from mint');
  }

  if (!isValidMint(toMint)) {
    errors.push('Invalid to mint');
  }

  if (!isValidAmount(amount)) {
    errors.push('Invalid amount');
  }

  if (fromMint === toMint) {
    errors.push('From and to mints must be different');
  }

  return { valid: errors.length === 0, errors };
}
