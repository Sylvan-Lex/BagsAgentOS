import { Command } from '@oclif/core';
import chalk from 'chalk';
import { getLanguage } from '../lib/config.js';

export default class Version extends Command {
  static description = '显示版本信息';

  static examples = ['$ bags version'];

  async run(): Promise<void> {
    const lang = getLanguage();
    const isZh = lang === 'zh';

    this.log(chalk.bold('\n🤖 BagsAgentOS\n'));
    this.log(chalk.gray(`  ${isZh ? '版本' : 'Version'}: 2.0.0`));
    this.log(chalk.gray(`  ${isZh ? '构建时间' : 'Built'}: ${new Date().toISOString()}`));
    this.log(chalk.gray(`  ${isZh ? '平台' : 'Platform'}: ${process.platform}`));
    this.log(chalk.gray(`  Node: ${process.version}`));
    this.log('');
    this.log(chalk.cyan('https://github.com/Sylvan-Lex/BagsAgentOS'));
  }
}
