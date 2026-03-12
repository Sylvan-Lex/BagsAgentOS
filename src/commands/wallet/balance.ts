import { Command, Flags } from '@oclif/core';
import chalk from 'chalk';
import ora from 'ora';
import { loadConfig, getLanguage } from '../../lib/config.js';
import { bagsClient } from '../../lib/bags-client.js';

export default class WalletBalance extends Command {
  static description = '查看钱包余额';

  static examples = ['$ bags wallet:balance', '$ bags wallet:balance --wallet <address>'];

  static flags = {
    wallet: Flags.string({ description: '钱包地址' }),
  };

  async run(): Promise<void> {
    const config = loadConfig();
    const lang = getLanguage();
    const isZh = lang === 'zh';

    if (!config.bags?.apiKey) {
      this.error(chalk.red(isZh ? '请先配置 Bags API Key' : 'Please configure Bags API Key first'));
    }

    const { flags } = await this.parse(WalletBalance);
    const spinner = ora(isZh ? '加载余额中...' : 'Loading balance...').start();

    try {
      bagsClient.init();
      
      let walletAddress = flags.wallet;
      if (!walletAddress) {
        const wallets = await bagsClient.listWallets();
        if (!wallets.wallets?.length) {
          spinner.fail();
          this.error(chalk.red(isZh ? '没有钱包' : 'No wallets found'));
        }
        walletAddress = wallets.wallets[0].address;
      }

      const balance = await bagsClient.getBalance(walletAddress);
      spinner.succeed();

      this.log(chalk.bold(`\n${isZh ? '余额' : 'Balance'} (${walletAddress.substring(0, 8)}...):\n`));
      this.log(chalk.cyan(`  SOL: ${balance.sol}`));
      
      if (balance.tokens?.length) {
        this.log(chalk.cyan(`\n  ${isZh ? '代币' : 'Tokens'}:`));
        for (const t of balance.tokens) {
          this.log(chalk.gray(`    ${t.symbol || t.mint?.substring(0, 8)}: ${t.amount}`));
        }
      }
    } catch (err: any) {
      spinner.fail();
      this.error(chalk.red(`${isZh ? '错误' : 'Error'}: ${(err as any).message}`));
    }
  }
}
