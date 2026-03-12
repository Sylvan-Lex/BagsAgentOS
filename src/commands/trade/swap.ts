import { Command, Flags } from '@oclif/core';
import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';
import { loadConfig, getLanguage } from '../../lib/config.js';
import { bagsClient } from '../../lib/bags-client.js';

export default class TradeSwap extends Command {
  static description = '交换代币';

  static examples = [
    '$ bags trade:swap --from So11111111111111111111111111111111111111112 --to EPjFWdd5AufqSSCwM1X5RUor4S6veMA2FVFkGPz8Srtv --amount 1',
  ];

  static flags = {
    from: Flags.string({ description: '源代币 mint' }),
    to: Flags.string({ description: '目标代币 mint' }),
    amount: Flags.string({ description: '数量' }),
  };

  async run(): Promise<void> {
    const config = loadConfig();
    const lang = getLanguage();
    const isZh = lang === 'zh';

    if (!config.bags?.apiKey) {
      this.error(chalk.red(isZh ? '请先配置 Bags API Key' : 'Please configure Bags API Key first'));
    }

    const { flags } = await this.parse(TradeSwap);
    
    let fromMint: string, toMint: string, amount: string;

    if (!flags.from || !flags.to || !flags.amount) {
      const answers = await inquirer.prompt([
        { type: 'input', name: 'from', message: isZh ? '源代币 mint (SOL=So11111111111111111111111111111111111111112):' : 'From mint (SOL=So11111111111111111111111111111111111111112):', default: 'So11111111111111111111111111111111111111112' },
        { type: 'input', name: 'to', message: isZh ? '目标代币 mint:' : 'To mint:', default: 'EPjFWdd5AufqSSCwM1X5RUor4S6veMA2FVFkGPz8Srtv' },
        { type: 'input', name: 'amount', message: isZh ? '数量:' : 'Amount:', default: '0.01' },
      ]);
      fromMint = answers.from;
      toMint = answers.to;
      amount = answers.amount;
    } else {
      fromMint = flags.from;
      toMint = flags.to;
      amount = flags.amount;
    }

    const spinner = ora(isZh ? '获取报价中...' : 'Getting quote...').start();

    try {
      bagsClient.init();
      
      const quote = await bagsClient.getQuote(fromMint, toMint, parseFloat(amount));
      spinner.succeed();

      this.log(chalk.bold(`\n${isZh ? '报价结果' : 'Quote Result'}:\n`));
      this.log(chalk.cyan(`  ${isZh ? '输入' : 'Input'}: ${quote.inAmount}`));
      this.log(chalk.cyan(`  ${isZh ? '输出' : 'Output'}: ${quote.outAmount}`));
      this.log(chalk.gray(`  ${isZh ? '价格影响' : 'Price Impact'}: ${quote.priceImpact}%`));
      
      const confirm = await inquirer.prompt([
        { type: 'confirm', name: 'proceed', message: isZh ? '确认交易?' : 'Confirm swap?', default: false },
      ]);

      if (confirm.proceed) {
        const swapSpinner = ora(isZh ? '执行交易中...' : 'Executing swap...').start();
        const wallets = await bagsClient.listWallets();
        if (!wallets.wallets?.length) {
          swapSpinner.fail();
          this.error(chalk.red(isZh ? '没有钱包' : 'No wallets found'));
        }
        
        const result = await bagsClient.swap(wallets.wallets[0].address, quote);
        swapSpinner.succeed();
        
        this.log(chalk.green(`\n${isZh ? '✓ 交易成功!' : '✓ Swap successful!'}\n`));
        this.log(chalk.gray(`  ${isZh ? '签名' : 'Signature'}: ${result.signature}`));
      } else {
        this.log(chalk.gray(isZh ? '已取消' : 'Cancelled'));
      }
      
    } catch (err: any) {
      spinner.fail();
      this.error(chalk.red(`${isZh ? '错误' : 'Error'}: ${err.message}`));
    }
  }
}
