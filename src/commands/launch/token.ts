import { Command, Flags } from '@oclif/core';
import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';
import { loadConfig, getLanguage } from '../../lib/config.js';
import { bagsClient, TokenInfo, FeeShareConfig } from '../../lib/bags-client.js';

export default class LaunchToken extends Command {
  static description = '发射新代币';

  static examples = [
    '$ bags launch:token --name "My Token" --symbol MTK --supply 1000000000',
  ];

  static flags = {
    name: Flags.string({ description: '代币名称 / Token name' }),
    symbol: Flags.string({ description: '代币符号 / Token symbol' }),
    supply: Flags.string({ description: '总供应量 / Total supply' }),
    uri: Flags.string({ description: 'metadata URI' }),
  };

  async run(): Promise<void> {
    const config = loadConfig();
    const lang = getLanguage();
    const isZh = lang === 'zh';

    // 检查配置
    if (!config.llm?.apiKey) {
      this.error(chalk.red(isZh ? '请先配置 LLM' : 'Please configure LLM first'));
    }
    if (!config.bags?.apiKey) {
      this.error(chalk.red(isZh ? '请先配置 Bags API Key: bags config:set-bags --api-key <key>' : 'Please configure Bags API Key: bags config:set-bags --api-key <key>'));
    }

    const { flags } = await this.parse(LaunchToken);
    
    let tokenInfo: TokenInfo;
    
    if (!flags.name || !flags.symbol) {
      // 交互式输入
      const answers = await inquirer.prompt([
        { type: 'input', name: 'name', message: isZh ? '代币名称:' : 'Token Name:', validate: (v) => v.length > 0 },
        { type: 'input', name: 'symbol', message: isZh ? '代币符号 (如 MTK):' : 'Token Symbol (e.g. MTK):', validate: (v) => v.length > 0 && v.length <= 10 },
        { type: 'input', name: 'supply', message: isZh ? '总供应量:' : 'Total Supply:', default: '1000000000' },
        { type: 'input', name: 'uri', message: isZh ? 'Metadata URI (可选):' : 'Metadata URI (optional):', default: '' },
      ]);
      
      tokenInfo = {
        name: answers.name,
        symbol: answers.symbol.toUpperCase(),
        metadataUri: answers.uri || `https://arweave.net/${Date.now()}`,
      };
    } else {
      tokenInfo = {
        name: flags.name,
        symbol: flags.symbol.toUpperCase(),
        metadataUri: flags.uri || `https://arweave.net/${Date.now()}`,
      };
    }

    const spinner = ora(isZh ? '创建代币中...' : 'Creating token...').start();

    try {
      bagsClient.init();
      
      // 创建代币信息
      const result = await bagsClient.createTokenInfo(tokenInfo);
      spinner.succeed();

      this.log(chalk.green(`\n${isZh ? '✓ 代币创建成功!' : '✓ Token created successfully!'}\n`));
      this.log(chalk.cyan(isZh ? '代币信息 ID:' : 'Token Info ID:'));
      this.log(chalk.gray(`  ${result.tokenInfoId}\n`));
      this.log(chalk.cyan(isZh ? '代币信息:' : 'Token Info:'));
      this.log(chalk.gray(`  Name: ${tokenInfo.name}`));
      this.log(chalk.gray(`  Symbol: ${tokenInfo.symbol}`));
      this.log(chalk.gray(`  URI: ${tokenInfo.metadataUri}`));
      
    } catch (err: any) {
      spinner.fail();
      this.error(chalk.red(`${isZh ? '错误' : 'Error'}: ${err.message}`));
    }
  }
}
