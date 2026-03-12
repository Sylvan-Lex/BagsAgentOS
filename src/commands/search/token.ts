import { Command, Flags } from '@oclif/core';
import chalk from 'chalk';
import { loadConfig, getLanguage } from '../../lib/config.js';
import { bagsClient } from '../../lib/bags-client.js';

export default class SearchToken extends Command {
  static description = '搜索代币信息';

  static examples = ['$ bags search:token --provider moltbook --username vitalik'];

  static flags = {
    provider: Flags.string({ description: 'Provider (moltbook/twitter/github)' }),
    username: Flags.string({ description: 'Username' }),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(SearchToken);
    const lang = getLanguage();
    const isZh = lang === 'zh';

    if (!flags.provider || !flags.username) {
      this.log(chalk.yellow(isZh ? '用法: bags search:token --provider moltbook --username <name>' : 'Usage: bags search:token --provider moltbook --username <name>'));
      return;
    }

    const provider = flags.provider as 'moltbook' | 'twitter' | 'github';
    if (!['moltbook', 'twitter', 'github'].includes(provider)) {
      this.log(chalk.red(isZh ? '无效提供商' : 'Invalid provider'));
      return;
    }

    try {
      const result = await bagsClient.lookupWallet(provider, flags.username);
      this.log(chalk.green(`\n${isZh ? '钱包地址' : 'Wallet Address'}:\n`));
      this.log(chalk.cyan(`  ${result.wallet}`));
    } catch (err: any) {
      this.error(chalk.red(`${isZh ? '错误' : 'Error'}: ${(err as any).message}`));
    }
  }
}
