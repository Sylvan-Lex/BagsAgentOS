import { Command } from '@oclif/core';
import chalk from 'chalk';
import { loadConfig, getLanguage } from '../lib/config.js';
import { bagsClient } from '../lib/bags-client.js';
import { llmClient } from '../lib/llm.js';

export default class Status extends Command {
  static description = '检查状态';

  static examples = ['$ bags status'];

  async run(): Promise<void> {
    const config = loadConfig();
    const lang = getLanguage();
    const isZh = lang === 'zh';

    this.log(chalk.bold(isZh ? '\n🔍 系统状态检查' : '\n🔍 System Status Check\n'));

    // LLM 状态
    this.log(chalk.cyan('LLM:'));
    if (config.llm?.apiKey) {
      this.log(chalk.green(`  ✓ ${isZh ? '已配置' : 'Configured'}`));
      this.log(chalk.gray(`    URL: ${config.llm.baseUrl}`));
      this.log(chalk.gray(`    ${isZh ? '模型' : 'Model'}: ${config.llm.model}`));
      
      // 测试 LLM
      try {
        llmClient.init();
        this.log(chalk.green(`  ✓ ${isZh ? '连接成功' : 'Connection OK'}`));
      } catch (err: any) {
        this.log(chalk.red(`  ✗ ${isZh ? '连接失败' : 'Connection failed'}: ${err.message}`));
      }
    } else {
      this.log(chalk.red(`  ✗ ${isZh ? '未配置' : 'Not configured'}`));
    }

    // Bags 状态
    this.log(chalk.cyan('\nBags:'));
    if (config.bags?.apiKey) {
      this.log(chalk.green(`  ✓ ${isZh ? '已配置' : 'Configured'}`));
      try {
        bagsClient.init();
        const wallets = await bagsClient.listWallets();
        this.log(chalk.green(`  ✓ ${isZh ? '连接成功' : 'Connection OK'}`));
        this.log(chalk.gray(`    ${isZh ? '钱包数' : 'Wallets'}: ${wallets.wallets?.length || 0}`));
      } catch (err: any) {
        this.log(chalk.red(`  ✗ ${isZh ? '连接失败' : 'Connection failed'}: ${(err as any).message}`));
      }
    } else {
      this.log(chalk.yellow(`  ⚠ ${isZh ? '未配置 (可选)' : 'Not configured (optional)'}`));
    }

    // 语言
    this.log(chalk.cyan(`\n${isZh ? '语言' : 'Language'}: ${lang === 'zh' ? '中文' : 'English'}`));

    this.log(chalk.bold(`\n${isZh ? '可用命令' : 'Available Commands'}:\n`));
    this.log(chalk.gray('  bags agent        - ' + (isZh ? '交互式 Agent' : 'Interactive Agent')));
    this.log(chalk.gray('  bags config:show - ' + (isZh ? '显示配置' : 'Show Config')));
    this.log(chalk.gray('  bags config:init - ' + (isZh ? '初始化配置' : 'Init Config')));
    this.log(chalk.gray('  bags wallet:list - ' + (isZh ? '列出钱包' : 'List Wallets')));
    this.log(chalk.gray('  bags launch:token - ' + (isZh ? '发射代币' : 'Launch Token')));
    this.log(chalk.gray('  bags trade:swap  - ' + (isZh ? '交换代币' : 'Swap Token')));
    this.log(chalk.gray('  bags claim:fees  - ' + (isZh ? '领取费用' : 'Claim Fees')));
  }
}
