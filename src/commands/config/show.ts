import { Command } from '@oclif/core';
import chalk from 'chalk';
import { loadConfig } from '../../lib/config.js';

export default class ConfigShowCommand extends Command {
  static description = '显示当前配置';

  static examples = [
    '$ bags config:show',
  ];

  async run(): Promise<void> {
    const config = loadConfig();

    this.log(chalk.bold('\n📋 Bags Agent 配置\n'));

    // LLM 配置
    if (config.llm?.apiKey) {
      this.log(chalk.cyan('LLM 配置:'));
      this.log(chalk.gray('  Base URL: ') + config.llm.baseUrl);
      this.log(chalk.gray('  Model: ') + config.llm.model);
      this.log(chalk.gray('  API Key: ') + config.llm.apiKey.substring(0, 10) + '...');
      this.log(chalk.green('  状态: ✓ 已配置'));
    } else {
      this.log(chalk.cyan('LLM 配置:'));
      this.log(chalk.yellow('  状态: ✗ 未配置'));
      this.log(chalk.gray('  运行: bags config:set --base-url <url> --model <model> --api-key <key>'));
    }

    // Bags 配置
    if (config.bags?.apiKey) {
      this.log(chalk.cyan('\nBags 配置:'));
      this.log(chalk.gray('  API Key: ') + config.bags.apiKey.substring(0, 10) + '...');
      if (config.bags.jwtToken) {
        this.log(chalk.gray('  JWT Token: ') + config.bags.jwtToken.substring(0, 10) + '...');
      }
      if (config.bags.moltbookUsername) {
        this.log(chalk.gray('  Moltbook: ') + config.bags.moltbookUsername);
      }
      this.log(chalk.green('  状态: ✓ 已配置'));
    } else {
      this.log(chalk.cyan('\nBags 配置:'));
      this.log(chalk.yellow('  状态: ✗ 未配置'));
      this.log(chalk.gray('  运行: bags config:set-bags --api-key <key>'));
    }

    this.log('');
  }
}