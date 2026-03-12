import { Command, Flags } from '@oclif/core';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { setLLMConfig, getLanguage } from '../../lib/config.js';

export default class ConfigSet extends Command {
  static description = '设置 LLM 配置';

  static examples = [
    '$ bags config:set --base-url https://api.openai.com/v1 --model gpt-4 --api-key sk-xxx',
  ];

  static flags = {
    'base-url': Flags.string({ description: 'LLM API Base URL' }),
    model: Flags.string({ description: 'Model name' }),
    'api-key': Flags.string({ description: 'API Key' }),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(ConfigSet);
    const lang = getLanguage();

    // 如果没有传入参数，交互式询问
    if (!flags['base-url'] && !flags.model && !flags['api-key']) {
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'baseUrl',
          message: lang === 'zh' ? 'Base URL:' : 'Base URL:',
          default: 'https://mgallery.haier.net/v1',
        },
        {
          type: 'input',
          name: 'model',
          message: lang === 'zh' ? 'Model:' : 'Model:',
          default: 'MiniMax-M2',
        },
        {
          type: 'password',
          name: 'apiKey',
          message: lang === 'zh' ? 'API Key:' : 'API Key:',
          mask: '*',
        },
      ]);

      setLLMConfig({
        baseUrl: answers.baseUrl,
        model: answers.model,
        apiKey: answers.apiKey,
      });
    } else {
      // 使用传入的参数
      setLLMConfig({
        baseUrl: flags['base-url'] || 'https://mgallery.haier.net/v1',
        model: flags.model || 'MiniMax-M2',
        apiKey: flags['api-key'] || '',
      });
    }

    if (lang === 'zh') {
      this.log(chalk.green('✓ LLM 配置已保存'));
    } else {
      this.log(chalk.green('✓ LLM Configuration saved'));
    }
  }
}
