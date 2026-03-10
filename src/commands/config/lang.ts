import { Command, Flags } from '@oclif/core';
import chalk from 'chalk';
import { setLanguage, getLanguage } from '../../lib/config.js';
import { printMiniLogo } from '../../lib/logo.js';

export default class ConfigLangCommand extends Command {
  static description = '设置语言 / Set language';

  static examples = [
    '$ bags config:lang --language zh',
    '$ bags config:lang --language en',
  ];

  static flags = {
    language: Flags.string({
      description: 'Language: en (English) or zh (中文)',
      required: true,
      options: ['en', 'zh'],
    }),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(ConfigLangCommand);
    const lang = flags.language as 'en' | 'zh';

    setLanguage(lang);

    const isEnglish = lang === 'en';
    const msg = isEnglish
      ? chalk.green('✓ Language set to English')
      : chalk.green('✓ 语言已设置为中文');

    this.log(msg);

    // 显示当前语言
    await printMiniLogo(lang);
  }
}