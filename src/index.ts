import { Command } from '@oclif/core';
import chalk from 'chalk';
import { printLogo } from './lib/logo.js';
import { loadConfig, getLanguage } from './lib/config.js';

export default class extends Command {
  static description = 'Bags CLI Agent - AI Agent for Solana Token Launchpad';

  static aliases = ['bags'];

  static enableJsonFlag = false;

  async run(): Promise<void> {
    // 获取当前语言
    const lang = getLanguage() || 'en';

    // 打印 Logo (带语言)
    await printLogo({ language: lang });

    // 加载配置
    const config = loadConfig();
    const isZh = lang === 'zh';

    // 检查配置状态
    const issues: string[] = [];

    if (!config.llm?.apiKey) {
      issues.push(isZh
        ? 'LLM 未配置: bags config:set --base-url <url> --model <model> --api-key <key>'
        : 'LLM not configured: bags config:set --base-url <url> --model <model> --api-key <key>');
    }

    if (!config.bags?.apiKey) {
      issues.push(isZh
        ? 'Bags API Key 未配置: bags config:set-bags --api-key <key>'
        : 'Bags API Key not configured: bags config:set-bags --api-key <key>');
    }

    if (issues.length > 0) {
      this.log(chalk.yellow(`\n${isZh ? '⚠️  请先完成配置:' : '⚠️  Please complete the configuration:'}\n`));
      issues.forEach(issue => {
        this.log(chalk.gray('  • ') + issue);
      });
      this.log('');
    } else {
      this.log(chalk.green(isZh ? '✓ 配置就绪' : '✓ Configuration ready'));
      this.log(chalk.gray(`  ${isZh ? '运行' : 'Run'} `) + chalk.cyan('bags agent') + chalk.gray(` ${isZh ? '启动交互模式' : 'to start interactive mode'}`));
      this.log('');
    }

    // 显示命令帮助
    this.log(chalk.cyan(isZh ? '可用命令:' : 'Available commands:'));
    this.log(chalk.gray('  bags config:set --base-url <url> --model <model> --api-key <key>'));
    this.log(chalk.gray('  bags config:set-bags --api-key <key>'));
    this.log(chalk.gray('  bags config:show'));
    this.log(chalk.gray('  bags config:init'));
    this.log(chalk.gray('  bags config:lang --language <en|zh>'));
    this.log(chalk.gray('  bags agent'));
    this.log('');
  }
}