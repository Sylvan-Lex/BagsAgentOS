import { Command, Flags } from '@oclif/core';
import chalk from 'chalk';
import ora from 'ora';
import { loadConfig, getLanguage } from '../../lib/config.js';
import { bagsClient } from '../../lib/bags-client.js';

export default class WalletList extends Command {
  static description = '列出钱包';

  static examples = ['$ bags wallet:list'];

  async run(): Promise<void> {
    const config = loadConfig();
    const lang = getLanguage();
    const isZh = lang === 'zh';

    if (!config.bags?.apiKey) {
      this.error(chalk.red(isZh ? '请先配置 Bags API Key' : 'Please configure Bags API Key first'));
    }

    const spinner = ora(isZh ? '加载钱包中...' : 'Loading wallets...').start();

    try {
      bagsClient.init();
      const result = await bagsClient.listWallets();
      spinner.succeed();

      if (!result.wallets?.length) {
        this.log(chalk.yellow(isZh ? '没有钱包' : 'No wallets found'));
        return;
      }

      this.log(chalk.bold(`\n${isZh ? '钱包列表' : 'Wallets'}:\n`));
      for (const w of result.wallets) {
        this.log(chalk.cyan(`  ${w.address}`));
        if (w.createdAt) this.log(chalk.gray(`    ${isZh ? '创建于' : 'Created'}: ${w.createdAt}`));
      }
    } catch (err: any) {
      spinner.fail();
      this.error(chalk.red(`${isZh ? '错误' : 'Error'}: ${err.message}`));
    }
  }
}
