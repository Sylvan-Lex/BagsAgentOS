import { Command, Flags } from '@oclif/core';
import chalk from 'chalk';
import { setBagsConfig, loadConfig } from '../../lib/config.js';

export default class ConfigSetBagsCommand extends Command {
  static description = '设置 Bags API Key';

  static examples = [
    '$ bags config:set-bags --api-key bags_xxx',
    '$ bags config:set-bags --api-key bags_xxx --jwt-token eyJxxx',
  ];

  static flags = {
    'api-key': Flags.string({ description: 'Bags API Key', required: true }),
    'jwt-token': Flags.string({ description: 'JWT Token (可选)', required: false }),
    'moltbook-username': Flags.string({ description: 'Moltbook 用户名 (可选)', required: false }),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(ConfigSetBagsCommand);

    setBagsConfig({
      apiKey: flags['api-key'],
      jwtToken: flags['jwt-token'] || '',
      moltbookUsername: flags['moltbook-username'] || '',
    });

    this.log(chalk.green('✓ Bags API Key 已保存'));
    this.log(chalk.gray('  API Key: ') + flags['api-key'].substring(0, 10) + '...');

    const config = loadConfig();
    if (config.llm?.apiKey) {
      this.log(chalk.green('\n✓ LLM 已配置'));
      this.log(chalk.gray('  Model: ') + config.llm.model);
    } else {
      this.log(chalk.yellow('\n! 请配置 LLM: bags config:set --base-url <url> --model <model> --api-key <key>'));
    }
  }
}