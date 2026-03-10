import { Command, Flags } from '@oclif/core';
import chalk from 'chalk';
import { setLLMConfig, loadConfig } from '../../lib/config.js';

export default class ConfigSetCommand extends Command {
  static description = '设置 LLM 配置';

  static examples = [
    '$ bags config:set --base-url https://api.openai.com/v1 --model gpt-4 --api-key sk-xxx',
    '$ bags config:set --base-url https://api.anthropic.com --model claude-3-5-sonnet-20241022 --api-key sk-ant-xxx',
  ];

  static flags = {
    'base-url': Flags.string({ description: 'LLM API base URL', required: true }),
    model: Flags.string({ description: 'Model name', required: true }),
    'api-key': Flags.string({ description: 'API Key', required: true }),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(ConfigSetCommand);

    setLLMConfig({
      baseUrl: flags['base-url'],
      model: flags.model,
      apiKey: flags['api-key'],
    });

    this.log(chalk.green('✓ LLM 配置已保存'));
    this.log(chalk.gray('  Base URL: ') + flags['base-url']);
    this.log(chalk.gray('  Model: ') + flags.model);

    const config = loadConfig();
    if (config.bags?.apiKey) {
      this.log(chalk.green('\n✓ Bags API Key 已配置'));
    } else {
      this.log(chalk.yellow('\n! 请配置 Bags API Key: bags config:set-bags --api-key <key>'));
    }
  }
}