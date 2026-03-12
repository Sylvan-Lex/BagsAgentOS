import { Command, Flags } from '@oclif/core';
import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';
import { loadConfig, getLanguage } from '../../lib/config.js';
import { bagsClient } from '../../lib/bags-client.js';

export default class ClaimFees extends Command {
  static description = '领取可领取费用';

  static examples = ['$ bags claim:fees'];

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

    const { flags } = await this.parse(ClaimFees);
    const spinner = ora(isZh ? '加载中...' : 'Loading...').start();

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

      spinner.text = isZh ? '加载可领取费用中...' : 'Loading claimable fees...';
      const result = await bagsClient.getClaimablePositions(walletAddress);
      spinner.succeed();

      if (!result.positions?.length) {
        this.log(chalk.yellow(isZh ? '没有可领取的费用' : 'No claimable fees'));
        return;
      }

      this.log(chalk.bold(`\n${isZh ? '可领取费用' : 'Claimable Fees'} (${walletAddress.substring(0, 8)}...):\n`));
      for (const p of result.positions) {
        this.log(chalk.cyan(`  ${p.tokenSymbol}: ${p.claimableAmount}`));
      }

      const confirm = await inquirer.prompt([
        { type: 'confirm', name: 'proceed', message: isZh ? '确认领取?' : 'Confirm claim?', default: true },
      ]);

      if (confirm.proceed) {
        const claimSpinner = ora(isZh ? '领取中...' : 'Claiming...').start();
        const positions = result.positions.map(p => ({ mint: p.mint, amount: p.claimableAmount }));
        const txResult = await bagsClient.claimFees(walletAddress, positions);
        claimSpinner.succeed();
        this.log(chalk.green(`\n${isZh ? '✓ 领取成功!' : '✓ Claim successful!'}\n`));
        this.log(chalk.gray(`  ${isZh ? '交易数' : 'Transactions'}: ${txResult.transactions.length}`));
      } else {
        this.log(chalk.gray(isZh ? '已取消' : 'Cancelled'));
      }

    } catch (err: any) {
      spinner.fail();
      this.error(chalk.red(`${isZh ? '错误' : 'Error'}: ${err.message}`));
    }
  }
}
