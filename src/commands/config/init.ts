import { Command } from '@oclif/core';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { setLLMConfig, setBagsConfig, loadConfig } from '../../lib/config.js';

export default class ConfigInitCommand extends Command {
  static description = '交互式初始化配置';

  static examples = [
    '$ bags config:init',
  ];

  async run(): Promise<void> {
    this.log(chalk.bold('\n🔧 Bags Agent 配置向导\n'));

    // 检查现有配置
    const config = loadConfig();

    // LLM 配置
    const llmAnswers = await inquirer.prompt([
      {
        type: 'input',
        name: 'baseUrl',
        message: 'LLM Base URL:',
        default: config.llm?.baseUrl || 'https://api.openai.com/v1',
      },
      {
        type: 'input',
        name: 'model',
        message: 'Model 名称:',
        default: config.llm?.model || 'gpt-4',
      },
      {
        type: 'password',
        name: 'apiKey',
        message: 'LLM API Key:',
        mask: '*',
      },
    ]);

    // Bags 配置
    const bagsAnswers = await inquirer.prompt([
      {
        type: 'input',
        name: 'apiKey',
        message: 'Bags API Key:',
      },
      {
        type: 'input',
        name: 'moltbookUsername',
        message: 'Moltbook 用户名 (可选):',
        default: config.bags?.moltbookUsername || '',
      },
    ]);

    // 保存配置
    setLLMConfig({
      baseUrl: llmAnswers.baseUrl,
      model: llmAnswers.model,
      apiKey: llmAnswers.apiKey,
    });

    setBagsConfig({
      apiKey: bagsAnswers.apiKey,
      moltbookUsername: bagsAnswers.moltbookUsername || '',
    });

    this.log(chalk.green('\n✓ 配置已保存!'));
    this.log(chalk.gray('\n运行 ') + chalk.cyan('bags agent') + chalk.gray(' 启动交互模式'));
  }
}