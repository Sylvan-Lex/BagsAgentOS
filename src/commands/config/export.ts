import { Command, Flags } from '@oclif/core';
import chalk from 'chalk';
import { loadConfig, setLLMConfig, setBagsConfig, AppConfig } from '../../lib/config.js';
import * as fs from 'fs';

export default class ConfigExport extends Command {
  static description = '导出/导入配置';

  static examples = [
    '$ bags config:export',
    '$ bags config:export --file config.json',
    '$ bags config:import --file config.json',
  ];

  static flags = {
    file: Flags.string({ description: '配置文件路径' }),
    import: Flags.boolean({ description: '导入模式' }),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(ConfigExport);
    const config = loadConfig();

    if (flags.import) {
      // 导入配置
      if (!flags.file) {
        this.error(chalk.red('请指定配置文件: --file <path>'));
        return;
      }

      try {
        const data = JSON.parse(fs.readFileSync(flags.file, 'utf-8'));
        if (data.llm) setLLMConfig(data.llm);
        if (data.bags) setBagsConfig(data.bags);
        this.log(chalk.green('✓ 配置已导入'));
      } catch (err: any) {
        this.error(chalk.red(`导入失败: ${(err as any).message}`));
      }
    } else {
      // 导出配置
      const output = {
        llm: config.llm ? { ...config.llm, apiKey: '***' } : undefined,
        bags: config.bags ? { ...config.bags, apiKey: '***' } : undefined,
      };

      if (flags.file) {
        fs.writeFileSync(flags.file, JSON.stringify(output, null, 2));
        this.log(chalk.green(`✓ 配置已导出到 ${flags.file}`));
      } else {
        console.log(JSON.stringify(output, null, 2));
      }
    }
  }
}
