import { Command } from '@oclif/core';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { printMiniLogo } from '../../lib/logo.js';
import { loadConfig, getLanguage, setLanguage, setLLMConfig, setBagsConfig, LLMConfig, BagsConfig } from '../../lib/config.js';
import { llmClient, LLMMessage } from '../../lib/llm.js';
import { spawn } from 'child_process';

// 国际化文本
const i18n = {
  en: {
    configCheck: '✓ Configuration check passed',
    inputHint: 'Enter your question or command, press Enter to send',
    exitHint: 'Type exit, quit, or q to exit',
    think: 'Thinking',
    error: 'Error',
    goodbye: 'Goodbye!',
    invalidCommand: 'Invalid command. Type /help for available commands.',
    settings: 'Settings',
    language: 'Language',
    llmConfig: 'LLM Configuration',
    bagsConfig: 'Bags Configuration',
    setLLM: 'Set LLM Config',
    setBags: 'Set Bags API Key',
    setLang: 'Set Language',
    help: `Available / Commands:
  /help     - Show this help message
  /config   - Show current configuration
  /llm      - Set LLM configuration
  /bags     - Set Bags API Key
  /lang     - Set language (en/zh)
  /clear    - Clear chat history
  /exit     - Exit the agent`,
    configTitle: 'Current Configuration',
    llmBaseUrl: 'Base URL',
    llmModel: 'Model',
    llmApiKey: 'API Key',
    bagsApiKey: 'Bags API Key',
    languageSet: 'Language set to English',
    configSaved: 'Configuration saved',
    clearHistory: 'Chat history cleared',
  },
  zh: {
    configCheck: '✓ 配置检查通过',
    inputHint: '输入你的问题或命令，按 Enter 发送',
    exitHint: '输入 exit, quit 或 q 退出',
    think: '思考中',
    error: '错误',
    goodbye: '再见!',
    invalidCommand: '无效命令。输入 /help 查看可用命令。',
    settings: '设置',
    language: '语言',
    llmConfig: 'LLM 配置',
    bagsConfig: 'Bags 配置',
    setLLM: '设置 LLM 配置',
    setBags: '设置 Bags API Key',
    setLang: '设置语言',
    help: `可用 / 命令:
  /help     - 显示帮助信息
  /config   - 显示当前配置
  /llm      - 设置 LLM 配置
  /bags     - 设置 Bags API Key
  /lang     - 设置语言 (en/zh)
  /clear    - 清除聊天记录
  /exit     - 退出 Agent`,
    configTitle: '当前配置',
    llmBaseUrl: 'Base URL',
    llmModel: 'Model',
    llmApiKey: 'API Key',
    bagsApiKey: 'Bags API Key',
    languageSet: '语言已设置为中文',
    configSaved: '配置已保存',
    clearHistory: '聊天记录已清除',
  },
};

type I18nKey = keyof typeof i18n.en;

export default class AgentStartCommand extends Command {
  static description = '启动交互式 Agent 模式';

  static examples = [
    '$ bags agent',
    '$ bags agent start',
  ];

  private language: 'en' | 'zh' = 'en';
  private messages: LLMMessage[] = [];

  // English system prompt
  private enSystemPrompt = `You are a Bags CLI Agent, helping users with token launch and trading on Solana blockchain.

Available commands:
1. View wallets - List all connected wallets
2. View balance - Check wallet balance
3. View claimable fees - Check available fees to claim
4. Launch token - Create a new token
5. Trade - Swap tokens
6. Exit - Exit the program

Execute corresponding operations based on user input.`;

  // Chinese system prompt
  private zhSystemPrompt = `你是一个 Bags CLI Agent，帮助用户在 Solana 区块链上进行代币发射和交易。

可用命令：
1. 查看钱包 - 列出所有关联的钱包
2. 查看余额 - 查看指定钱包的余额
3. 查看可领取费用 - 查看可以领取的费用
4. 发射代币 - 创建一个新代币
5. 交易 - 交换代币
6. 退出 - 退出程序

请根据用户输入执行相应操作。`;

  async run(): Promise<void> {
    const config = loadConfig();
    this.language = getLanguage() || 'en';
    const t = i18n[this.language];

    // 打印 Mini Logo
    await printMiniLogo(this.language);

    // 检查配置
    if (!config.llm?.apiKey) {
      this.error(chalk.red(this.language === 'zh' ? 'LLM 未配置，请先运行: bags config:set --base-url <url> --model <model> --api-key <key>' : 'LLM not configured. Run: bags config:set --base-url <url> --model <model> --api-key <key>'));
    }

    if (!config.bags?.apiKey) {
      this.error(chalk.red(this.language === 'zh' ? 'Bags API Key 未配置，请先运行: bags config:set-bags --api-key <key>' : 'Bags API Key not configured. Run: bags config:set-bags --api-key <key>'));
    }

    this.log(chalk.green(`\n${t.configCheck}\n`));
    this.log(chalk.gray(t.inputHint));
    this.log(chalk.gray(`${t.exitHint}\n`));

    // 初始化客户端
    try {
      llmClient.init();
    } catch (err: any) {
      this.error(chalk.red(`${this.language === 'zh' ? '初始化失败' : 'Initialization failed'}: ${err.message}`));
    }

    // REPL 循环
    await this.startRepl();
  }

  private getT(): typeof i18n['en'] {
    return i18n[this.language];
  }

  private getSystemPrompt(): string {
    return this.language === 'zh' ? this.zhSystemPrompt : this.enSystemPrompt;
  }

  private async handleSlashCommand(input: string): Promise<boolean> {
    const t = this.getT();
    // 只提取命令部分（第一个空格前的部分）
    const cmd = input.toLowerCase().trim().split(' ')[0];

    // /help
    if (cmd === '/help' || cmd === '/h' || cmd === '/?') {
      this.log(chalk.cyan(t.help));
      return true;
    }

    // /config - 显示当前配置
    if (cmd === '/config' || cmd === '/c') {
      const config = loadConfig();
      this.log(chalk.bold(`\n${t.configTitle}:\n`));

      if (config.llm?.apiKey) {
        this.log(chalk.cyan(`${t.llmConfig}:`));
        this.log(chalk.gray(`  ${t.llmBaseUrl}: ${config.llm.baseUrl}`));
        this.log(chalk.gray(`  ${t.llmModel}: ${config.llm.model}`));
        this.log(chalk.gray(`  ${t.llmApiKey}: ${config.llm.apiKey.substring(0, 10)}...`));
      }

      if (config.bags?.apiKey) {
        this.log(chalk.cyan(`\n${t.bagsConfig}:`));
        this.log(chalk.gray(`  ${t.bagsApiKey}: ${config.bags.apiKey.substring(0, 10)}...`));
      }

      this.log(chalk.cyan(`\n${t.language}: ${this.language === 'zh' ? '中文' : 'English'}`));
      return true;
    }

    // /llm - 设置 LLM 配置
    if (cmd === '/llm') {
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'baseUrl',
          message: `${t.llmBaseUrl}:`,
          default: 'https://api.openai.com/v1',
        },
        {
          type: 'input',
          name: 'model',
          message: `${t.llmModel}:`,
          default: 'gpt-4',
        },
        {
          type: 'password',
          name: 'apiKey',
          message: `${t.llmApiKey}:`,
          mask: '*',
        },
      ]);

      setLLMConfig({
        baseUrl: answers.baseUrl,
        model: answers.model,
        apiKey: answers.apiKey,
      });

      this.log(chalk.green(`\n${t.configSaved}`));
      return true;
    }

    // /bags - 设置 Bags API Key
    if (cmd === '/bags') {
      // 检查是否有直接传入的参数
      const args = input.trim().split(' ').slice(1).join(' ');

      if (args) {
        // 直接使用参数作为 API Key
        setBagsConfig({
          apiKey: args,
        });
        this.log(chalk.green(`\n${t.configSaved}`));
        this.log(chalk.gray(`  ${t.bagsApiKey}: ${args.substring(0, 10)}...`));
      } else {
        // 交互式输入
        const answers = await inquirer.prompt([
          {
            type: 'input',
            name: 'apiKey',
            message: `${t.bagsApiKey}:`,
          },
        ]);

        setBagsConfig({
          apiKey: answers.apiKey,
        });

        this.log(chalk.green(`\n${t.configSaved}`));
      }
      return true;
    }

    // /lang - 设置语言
    if (cmd === '/lang') {
      // 检查是否有直接传入的参数
      const args = input.trim().split(' ').slice(1).join(' ').trim().toLowerCase();

      if (args === 'en' || args === 'zh') {
        // 直接使用参数
        this.language = args;
        setLanguage(this.language);
      } else {
        // 交互式选择
        const answers = await inquirer.prompt([
          {
            type: 'list',
            name: 'language',
            message: `${t.language} / Language:`,
            choices: [
              { name: 'English', value: 'en' },
              { name: '中文', value: 'zh' },
            ],
            default: this.language,
          },
        ]);

        this.language = answers.language;
        setLanguage(this.language);
      }

      this.log(chalk.green(`\n${this.language === 'zh' ? t.languageSet : 'Language set to English'}`));
      await printMiniLogo(this.language);
      return true;
    }

    // /clear - 清除聊天记录
    if (cmd === '/clear') {
      this.messages = [];
      this.log(chalk.green(`\n${t.clearHistory}`));
      return true;
    }

    // /exit
    if (cmd === '/exit') {
      this.log(chalk.gray(`\n👋 ${t.goodbye}`));
      process.exit(0);
    }

    return false;
  }

  private async startRepl(): Promise<void> {
    const t = this.getT();

    while (true) {
      try {
        const answers = await inquirer.prompt([
          {
            type: 'input',
            name: 'input',
            message: '',
          },
        ]);

        const input = answers.input as string;

        if (!input.trim()) continue;

        // 检查是否是 / 命令
        if (input.trim().startsWith('/')) {
          const handled = await this.handleSlashCommand(input);
          if (handled) continue;
          this.log(chalk.yellow(t.invalidCommand));
          continue;
        }

        // 检查退出命令
        if (['exit', 'quit', 'q'].includes(input.toLowerCase())) {
          this.log(chalk.gray(`\n👋 ${t.goodbye}`));
          break;
        }

        // 添加用户消息
        this.messages.push({ role: 'user', content: input });

        // 显示思考中
        process.stdout.write(chalk.gray(`  ${t.think}`));
        const loadingDots = ['.  ', '.. ', '...'];
        let dotIndex = 0;
        const loadingInterval = setInterval(() => {
          process.stdout.write(`\r${chalk.gray(`  ${t.think}` + loadingDots[dotIndex])}`);
          dotIndex = (dotIndex + 1) % loadingDots.length;
        }, 300);

        // 调用 LLM
        try {
          const response = await llmClient.sendMessage(this.messages, this.getSystemPrompt());
          clearInterval(loadingInterval);
          process.stdout.write('\r' + ' '.repeat(20) + '\r');

          // 显示响应
          this.log(chalk.white(response));

          // 添加助手消息
          this.messages.push({ role: 'assistant', content: response });
        } catch (err: any) {
          clearInterval(loadingInterval);
          process.stdout.write('\r' + ' '.repeat(20) + '\r');
          this.log(chalk.red(`\n${t.error}: ${err.message}`));
        }
      } catch (err: any) {
        if ((err as any).message === 'User force closed prompt') {
          this.log(chalk.gray(`\n\n👋 ${t.goodbye}`));
          break;
        }
        this.log(chalk.red(`\n${t.error}: ${(err as any).message}`));
      }
    }
  }
}