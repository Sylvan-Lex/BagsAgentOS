import { Command } from '@oclif/core';
import chalk from 'chalk';
import { loadConfig, getLanguage } from '../../lib/config.js';

export default class ConfigShow extends Command {
  static description = '显示当前配置';

  static examples = [
    '$ bags config:show',
  ];

  async run(): Promise<void> {
    const config = loadConfig();
    const lang = getLanguage();

    if (lang === 'zh') {
      this.log(chalk.bold('📋 Bags Agent 配置\n'));
      
      this.log(chalk.cyan('LLM 配置:'));
      if (config.llm?.apiKey) {
        this.log(chalk.gray(`  Base URL: ${config.llm.baseUrl}`));
        this.log(chalk.gray(`  Model: ${config.llm.model}`));
        this.log(chalk.gray(`  API Key: ${config.llm.apiKey.substring(0, 10)}...`));
        this.log(chalk.green('  状态: ✓ 已配置'));
      } else {
        this.log(chalk.gray('  状态: ✗ 未配置'));
        this.log(chalk.gray('  运行: bags config:set --base-url <url> --model <model> --api-key <key>'));
      }

      this.log(chalk.cyan('\nBags 配置:'));
      if (config.bags?.apiKey) {
        this.log(chalk.gray(`  API Key: ${config.bags.apiKey.substring(0, 10)}...`));
        this.log(chalk.green('  状态: ✓ 已配置'));
      } else {
        this.log(chalk.gray('  状态: ✗ 未配置'));
        this.log(chalk.gray('  运行: bags config:set-bags --api-key <key>'));
      }

      this.log(chalk.cyan('\n语言:'), lang === 'zh' ? '中文' : 'English');
    } else {
      this.log(chalk.bold('📋 Bags Agent Configuration\n'));
      
      this.log(chalk.cyan('LLM Configuration:'));
      if (config.llm?.apiKey) {
        this.log(chalk.gray(`  Base URL: ${config.llm.baseUrl}`));
        this.log(chalk.gray(`  Model: ${config.llm.model}`));
        this.log(chalk.gray(`  API Key: ${config.llm.apiKey.substring(0, 10)}...`));
        this.log(chalk.green('  Status: ✓ Configured'));
      } else {
        this.log(chalk.gray('  Status: ✗ Not configured'));
        this.log(chalk.gray('  Run: bags config:set --base-url <url> --model <model> --api-key <key>'));
      }

      this.log(chalk.cyan('\nBags Configuration:'));
      if (config.bags?.apiKey) {
        this.log(chalk.gray(`  API Key: ${config.bags.apiKey.substring(0, 10)}...`));
        this.log(chalk.green('  Status: ✓ Configured'));
      } else {
        this.log(chalk.gray('  Status: ✗ Not configured'));
        this.log(chalk.gray('  Run: bags config:set-bags --api-key <key>'));
      }

      this.log(chalk.cyan('\nLanguage:'), (lang as string) === 'zh' ? '中文' : 'English');
    }
  }
}
