import { Command } from '@oclif/core';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { setLLMConfig, setBagsConfig, getLanguage, setLanguage } from '../../lib/config.js';

export default class ConfigInit extends Command {
  static description = '交互式初始化配置';

  static examples = ['$ bags config:init'];

  async run(): Promise<void> {
    const lang = getLanguage();
    const isZh = lang === 'zh';

    this.log(chalk.bold(isZh ? '\n🔧 初始化配置...' : '\n🔧 Initializing configuration...\n'));

    // 语言选择
    const langAnswer = await inquirer.prompt([
      {
        type: 'list',
        name: 'language',
        message: isZh ? '选择语言 / Select Language:' : 'Select Language:',
        choices: [
          { name: 'English', value: 'en' },
          { name: '中文', value: 'zh' },
        ],
        default: lang || 'en',
      },
    ]);
    
    setLanguage(langAnswer.language);
    const t = langAnswer.language === 'zh';

    // LLM 配置
    const llmAnswers = await inquirer.prompt([
      {
        type: 'input',
        name: 'baseUrl',
        message: t ? 'LLM Base URL:' : 'LLM Base URL:',
        default: 'https://mgallery.haier.net/v1',
      },
      {
        type: 'input',
        name: 'model',
        message: t ? 'Model:' : 'Model:',
        default: 'MiniMax-M2',
      },
      {
        type: 'password',
        name: 'apiKey',
        message: t ? 'API Key:' : 'API Key:',
        mask: '*',
      },
    ]);

    setLLMConfig({
      baseUrl: llmAnswers.baseUrl,
      model: llmAnswers.model,
      apiKey: llmAnswers.apiKey,
    });

    // Bags 配置
    const bagsAnswers = await inquirer.prompt([
      {
        type: 'input',
        name: 'apiKey',
        message: t ? 'Bags API Key (可选，回车跳过):' : 'Bags API Key (optional, skip with enter):',
        default: '',
      },
    ]);

    if (bagsAnswers.apiKey) {
      setBagsConfig({ apiKey: bagsAnswers.apiKey });
    }

    this.log(chalk.green(`\n${t ? '✓ 配置完成!' : '✓ Configuration complete!'}\n`));
    
    this.log(chalk.cyan(t ? '运行以下命令启动:' : 'Run the following to start:'));
    this.log(chalk.gray('  bags agent'));
  }
}
