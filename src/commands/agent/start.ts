import { Command } from '@oclif/core';
import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';
import { printMiniLogo } from '../../lib/logo.js';
import { loadConfig, getLanguage, setLanguage, setLLMConfig, setBagsConfig, LLMConfig, BagsConfig, AppConfig } from '../../lib/config.js';
import { llmClient, LLMMessage } from '../../lib/llm.js';
import { bagsClient } from '../../lib/bags-client.js';

const i18n = {
  en: {
    configCheck: '✓ Configuration check passed',
    inputHint: 'Enter your question or command, press Enter to send',
    exitHint: 'Type exit, quit, or q to exit',
    think: 'Thinking',
    error: 'Error',
    goodbye: 'Goodbye!',
    invalidCommand: 'Invalid command. Type /help for available commands.',
    help: `Available Commands:
  /help     - Show this help
  /config   - Show configuration
  /llm      - Set LLM config
  /bags     - Set Bags API Key
  /lang     - Set language (en/zh)
  /clear    - Clear chat history
  /wallets  - List wallets
  /balance  - Check balance
  /fees     - Check claimable fees
  /quote    - Get swap quote
  /exit     - Exit`,
    configTitle: 'Current Configuration',
    llmConfig: 'LLM Configuration',
    llmBaseUrl: 'Base URL',
    llmModel: 'Model',
    llmApiKey: 'API Key',
    bagsConfig: 'Bags Configuration',
    bagsApiKey: 'Bags API Key',
    configSaved: 'Configuration saved',
    clearHistory: 'Chat history cleared',
    walletsTitle: 'Connected Wallets',
    balanceTitle: 'Wallet Balance',
    feesTitle: 'Claimable Fees',
    quoteTitle: 'Swap Quote',
    noWallets: 'No wallets found',
    noFees: 'No claimable fees',
    thinkWithModel: 'Thinking (using {model})',
    languageSet: 'Language set to English',
    needBagsKey: 'Please configure Bags API Key first: /bags <your-api-key>',
    usage: 'Usage: /quote <from_mint> <to_mint> <amount>',
  },
  zh: {
    configCheck: '✓ 配置检查通过',
    inputHint: '输入问题或命令，按 Enter 发送',
    exitHint: '输入 exit, quit 或 q 退出',
    think: '思考中',
    error: '错误',
    goodbye: '再见!',
    invalidCommand: '无效命令，输入 /help 查看命令',
    help: `可用命令:
  /help     - 显示帮助
  /config   - 显示配置
  /llm      - 设置 LLM
  /bags     - 设置 Bags API
  /lang     - 设置语言 (en/zh)
  /clear    - 清除历史
  /wallets  - 列出钱包
  /balance  - 查看余额
  /fees     - 查看可领取费用
  /quote    - 获取兑换报价
  /exit     - 退出`,
    configTitle: '当前配置',
    llmConfig: 'LLM 配置',
    llmBaseUrl: 'Base URL',
    llmModel: 'Model',
    llmApiKey: 'API Key',
    bagsConfig: 'Bags 配置',
    bagsApiKey: 'Bags API Key',
    configSaved: '配置已保存',
    clearHistory: '聊天记录已清除',
    walletsTitle: '关联钱包',
    balanceTitle: '钱包余额',
    feesTitle: '可领取费用',
    quoteTitle: '兑换报价',
    noWallets: '未找到钱包',
    noFees: '无可领取费用',
    thinkWithModel: '思考中 (使用 {model})',
    languageSet: '语言已设置为中文',
    needBagsKey: '请先配置 Bags API Key: /bags <your-api-key>',
    usage: '用法: /quote <from_mint> <to_mint> <amount>',
  },
};

export default class AgentStartCommand extends Command {
  static description = '启动交互式 Agent 模式';

  static examples = ['$ bags agent', '$ bags agent start'];

  private language: 'en' | 'zh' = 'en';
  private messages: LLMMessage[] = [];
  private appConfig: AppConfig = loadConfig();

  private enSystemPrompt = `You are a Bags CLI Agent for Solana token launch and trading.

Capabilities:
1. View wallets - List connected wallets
2. View balance - Check wallet balance
3. View fees - Check claimable fees
4. Get quote - Get swap quote
5. Launch token - Create new token
6. Trade - Swap tokens

Use bagsClient for real data. Respond in the same language as user.`;

  private zhSystemPrompt = `你是一个 Bags CLI Agent，帮助用户在 Solana 上进行代币发射和交易。

能力:
1. 查看钱包 - 列出钱包
2. 查看余额 - 查看余额
3. 查看费用 - 查看可领取费用
4. 获取报价 - 获取兑换报价
5. 发射代币 - 创建新代币
6. 交易 - 交换代币

使用 bagsClient 获取真实数据。用用户相同的语言回复。`;

  async run(): Promise<void> {
    this.appConfig = loadConfig();
    this.language = getLanguage() || 'en';
    const t = i18n[this.language];

    await printMiniLogo(this.language);

    if (!this.appConfig.llm?.apiKey) {
      this.error(chalk.red('LLM not configured. Run: bags config:set --api-key <key>'));
    }

    this.log(chalk.green(`\n${t.configCheck}\n`));
    this.log(chalk.gray(t.inputHint));
    this.log(chalk.gray(`${t.exitHint}\n`));

    try {
      llmClient.init();
      if (this.appConfig.bags?.apiKey) {
        bagsClient.init();
      }
    } catch (err: any) {
      this.error(chalk.red(`Initialization failed: ${err.message}`));
    }

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
    const cmd = input.toLowerCase().trim().split(' ')[0];
    const config = loadConfig();

    if (cmd === '/help' || cmd === '/h' || cmd === '/?') {
      this.log(chalk.cyan(t.help));
      return true;
    }

    if (cmd === '/config' || cmd === '/c') {
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
      return true;
    }

    if (cmd === '/llm') {
      const answers = await inquirer.prompt([
        { type: 'input', name: 'baseUrl', message: `${t.llmBaseUrl}:`, default: config.llm?.baseUrl || 'https://mgallery.haier.net/v1' },
        { type: 'input', name: 'model', message: `${t.llmModel}:`, default: config.llm?.model || 'MiniMax-M2' },
        { type: 'password', name: 'apiKey', message: `${t.llmApiKey}:`, default: config.llm?.apiKey || '', mask: '*' },
      ]);
      setLLMConfig({ baseUrl: answers.baseUrl, model: answers.model, apiKey: answers.apiKey });
      llmClient.init();
      this.log(chalk.green(`\n${t.configSaved}`));
      return true;
    }

    if (cmd === '/bags') {
      const args = input.trim().split(' ').slice(1).join(' ');
      if (args) {
        setBagsConfig({ apiKey: args });
      } else {
        const answers = await inquirer.prompt([{ type: 'input', name: 'apiKey', message: `${t.bagsApiKey}:` }]);
        setBagsConfig({ apiKey: answers.apiKey });
      }
      try { bagsClient.init(); } catch {}
      this.log(chalk.green(`\n${t.configSaved}`));
      return true;
    }

    if (cmd === '/lang') {
      const args = input.trim().split(' ').slice(1).join(' ').trim().toLowerCase();
      if (args === 'en' || args === 'zh') {
        this.language = args;
        setLanguage(this.language);
      } else {
        const answers = await inquirer.prompt([
          { type: 'list', name: 'language', message: 'Language:', choices: [{ name: 'English', value: 'en' }, { name: '中文', value: 'zh' }], default: this.language },
        ]);
        this.language = answers.language;
        setLanguage(this.language);
      }
      this.log(chalk.green(`\n${this.language === 'zh' ? t.languageSet : 'Language set to English'}`));
      await printMiniLogo(this.language);
      return true;
    }

    if (cmd === '/clear') {
      this.messages = [];
      this.log(chalk.green(`\n${t.clearHistory}`));
      return true;
    }

    if (cmd === '/wallets' || cmd === '/wallet') {
      await this.listWallets();
      return true;
    }

    if (cmd === '/balance' || cmd === '/bal') {
      await this.checkBalance();
      return true;
    }

    if (cmd === '/fees' || cmd === '/fee') {
      await this.checkFees();
      return true;
    }

    if (cmd === '/quote') {
      await this.getQuote(input);
      return true;
    }

    if (cmd === '/exit') {
      this.log(chalk.gray(`\n👋 ${t.goodbye}`));
      process.exit(0);
    }

    return false;
  }

  private async listWallets(): Promise<void> {
    const t = this.getT();
    const spinner = ora(this.language === 'zh' ? '加载钱包中...' : 'Loading wallets...').start();
    try {
      const result = await bagsClient.listWallets();
      spinner.succeed();
      this.log(chalk.bold(`\n${t.walletsTitle}:\n`));
      if (result.wallets?.length) {
        for (const w of result.wallets) this.log(chalk.cyan(`  ${w.address}`));
      } else {
        this.log(chalk.gray(t.noWallets));
      }
    } catch (err: any) {
      spinner.fail();
      this.log(chalk.red(`${t.error}: ${err.message}`));
    }
  }

  private async checkBalance(): Promise<void> {
    const t = this.getT();
    const config = loadConfig();
    if (!config.bags?.apiKey) { this.log(chalk.yellow(t.needBagsKey)); return; }
    const spinner = ora(this.language === 'zh' ? '加载余额中...' : 'Loading balance...').start();
    try {
      const wallets = await bagsClient.listWallets();
      if (!wallets.wallets?.length) { spinner.fail(); this.log(chalk.yellow(t.noWallets)); return; }
      const balance = await bagsClient.getBalance(wallets.wallets[0].address);
      spinner.succeed();
      this.log(chalk.bold(`\n${t.balanceTitle}:\n`));
      this.log(chalk.cyan(`  SOL: ${balance.sol}`));
    } catch (err: any) {
      spinner.fail();
      this.log(chalk.red(`${t.error}: ${err.message}`));
    }
  }

  private async checkFees(): Promise<void> {
    const t = this.getT();
    const config = loadConfig();
    if (!config.bags?.apiKey) { this.log(chalk.yellow(t.needBagsKey)); return; }
    const spinner = ora(this.language === 'zh' ? '加载费用中...' : 'Loading fees...').start();
    try {
      const wallets = await bagsClient.listWallets();
      if (!wallets.wallets?.length) { spinner.fail(); this.log(chalk.yellow(t.noWallets)); return; }
      const result = await bagsClient.getClaimablePositions(wallets.wallets[0].address);
      spinner.succeed();
      this.log(chalk.bold(`\n${t.feesTitle}:\n`));
      if (result.positions?.length) {
        for (const p of result.positions) this.log(chalk.cyan(`  ${p.tokenSymbol}: ${p.claimableAmount}`));
      } else {
        this.log(chalk.gray(t.noFees));
      }
    } catch (err: any) {
      spinner.fail();
      this.log(chalk.red(`${t.error}: ${err.message}`));
    }
  }

  private async getQuote(input: string): Promise<void> {
    const t = this.getT();
    const args = input.trim().split(' ').slice(1);
    if (args.length < 3) { this.log(chalk.yellow(t.usage)); return; }
    const [fromMint, toMint, amount] = args;
    const spinner = ora(this.language === 'zh' ? '获取报价中...' : 'Getting quote...').start();
    try {
      const quote = await bagsClient.getQuote(fromMint, toMint, parseFloat(amount));
      spinner.succeed();
      this.log(chalk.bold(`\n${t.quoteTitle}:\n`));
      this.log(chalk.cyan(`  ${this.language === 'zh' ? '输入' : 'Input'}: ${quote.inAmount}`));
      this.log(chalk.cyan(`  ${this.language === 'zh' ? '输出' : 'Output'}: ${quote.outAmount}`));
      this.log(chalk.gray(`  ${this.language === 'zh' ? '价格影响' : 'Price Impact'}: ${quote.priceImpact}%`));
    } catch (err: any) {
      spinner.fail();
      this.log(chalk.red(`${t.error}: ${err.message}`));
    }
  }

  private async startRepl(): Promise<void> {
    const t = this.getT();
    while (true) {
      try {
        const answers = await inquirer.prompt([{ type: 'input', name: 'input', message: '' }]);
        const input = answers.input as string;
        if (!input.trim()) continue;
        if (input.trim().startsWith('/')) {
          if (await this.handleSlashCommand(input)) continue;
          this.log(chalk.yellow(t.invalidCommand));
          continue;
        }
        if (['exit', 'quit', 'q'].includes(input.toLowerCase())) {
          this.log(chalk.gray(`\n👋 ${t.goodbye}`));
          break;
        }
        this.messages.push({ role: 'user', content: input });
        const config = loadConfig();
        const modelName = config.llm?.model || 'MiniMax-M2';
        const thinkMsg = t.thinkWithModel.replace('{model}', modelName);
        process.stdout.write(chalk.gray(`  ${thinkMsg}`));
        const dots = ['.  ', '.. ', '...'];
        let idx = 0;
        const interval = setInterval(() => { process.stdout.write(`\r${chalk.gray(`  ${thinkMsg}` + dots[idx])}`); idx = (idx + 1) % 3; }, 300);
        try {
          const response = await llmClient.sendMessage(this.messages, this.getSystemPrompt());
          clearInterval(interval);
          process.stdout.write('\r' + ' '.repeat(30) + '\r');
          this.log(chalk.white(response));
          this.messages.push({ role: 'assistant', content: response });
        } catch (err: any) {
          clearInterval(interval);
          process.stdout.write('\r' + ' '.repeat(30) + '\r');
          this.log(chalk.red(`\n${t.error}: ${err.message}`));
        }
      } catch (err: any) {
        if ((err as any).message === 'User force closed prompt') { this.log(chalk.gray(`\n\n👋 ${t.goodbye}`)); break; }
        this.log(chalk.red(`\n${t.error}: ${(err as any).message}`));
      }
    }
  }
}
