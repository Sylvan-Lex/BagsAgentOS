import { Command } from '@oclif/core';
import chalk from 'chalk';

export default class TokensPopular extends Command {
  static description = '显示常用代币';

  static examples = ['$ bags tokens:popular'];

  async run(): Promise<void> {
    const tokens = [
      { symbol: 'SOL', name: 'Solana', mint: 'So11111111111111111111111111111111111111112' },
      { symbol: 'USDC', name: 'USD Coin', mint: 'EPjFWdd5AufqSSCwM1X5RUor4S6veMA2FVFkGPz8Srtv' },
      { symbol: 'USDT', name: 'Tether USD', mint: 'Es9vMFrzaCERmJfrF4H2FY4WDGWEmNPG9XFvJQVwc1eu' },
      { symbol: 'BONK', name: 'Bonk', mint: 'DezXAZ8z7PnrnzNTT1t5uT9M9hJ9v6r2vE4v5y8v2Fz' },
      { symbol: 'WIF', name: 'WIF', mint: '85VBFQZC9TZkfaptBWqv14ALD9fJNUKtWA41kh69teRP' },
      { symbol: 'JUP', name: 'Jupiter', mint: 'JUPyiwrYJFskUPiHa7hkeR8VUtkqjberbSOWd91pbT' },
      { symbol: 'RAY', name: 'Raydium', mint: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkkqdRSVD4oNXBiLVxm' },
    ];

    this.log(chalk.bold('\n📊 常用代币 / Popular Tokens\n'));
    this.log(chalk.cyan('Symbol'.padEnd(10)) + chalk.cyan('Name'.padEnd(20)) + chalk.cyan('Mint'));
    this.log(chalk.gray('-'.repeat(70)));
    
    for (const t of tokens) {
      const symbol = chalk.white(t.symbol.padEnd(10));
      const name = chalk.gray(t.name.padEnd(20));
      const mint = chalk.gray(t.mint.substring(0, 32) + '...');
      this.log(symbol + name + mint);
    }

    this.log(chalk.gray('\n使用: bags trade:swap --from <from> --to <to> --amount <amount>'));
  }
}
