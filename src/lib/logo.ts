import chalk from 'chalk';
import terminalImage from 'terminal-image';
import path from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Bags Agent OS Logo
 * 使用图片显示 Logo
 */

export interface LogoOptions {
  language?: 'en' | 'zh';
}

/**
 * 获取 Logo 图片路径
 */
function getLogoImagePath(): string {
  // 首先检查项目目录
  const projectPath = path.join(__dirname, '..', '..', 'assets', 'bags-icon.png');
  const homePath = path.join(process.env.HOME || '', '.config', 'bags-agent', 'bags-icon.png');

  if (existsSync(projectPath)) {
    return projectPath;
  }
  if (existsSync(homePath)) {
    return homePath;
  }

  // 默认返回项目路径
  return projectPath;
}

/**
 * 打印图片 Logo
 */
async function printImageLogo(): Promise<void> {
  try {
    const imagePath = getLogoImagePath();
    if (existsSync(imagePath)) {
      // 等比缩小3倍，左对齐
      const image = await terminalImage.file(imagePath, { height: 7 });
      // 移除两端的空格，实现左对齐
      const leftAligned = image.trimStart();
      console.log(chalk.cyan(leftAligned));
      return;
    }
  } catch (e) {
    // 如果图片加载失败，使用备用 ASCII
  }

  // 备用 ASCII Logo（当图片不存在时）
  printAsciiLogo();
}

/**
 * 备用 ASCII Logo
 */
function printAsciiLogo(): void {
  const icon = chalk.cyan(`
    @@@@@@--@@@@@@
    @@@@@-----@@@@@
    @@@@-------@@@@
    @@@--------@@@@
    @@---@@@---@@@
    @@-@@@@@@@-@@
    @@@@--@@--@@@@
    @@@--------@@@
    @@--------@@@
    @@---@@@---@@
    @@--------@@@
    @@--------@@@
    @@@------@@@@
    @@@@@---@@@@@
    @@@@@@-@@@@@@
  `);
  console.log(icon);
}

export async function printLogo(options: LogoOptions = {}): Promise<void> {
  const lang = options.language || 'en';
  const isEnglish = lang === 'en';

  // 绿色 BAGS AGENT OS 文字
  const textLogo = chalk.green.bold(`
  ████████╗██████╗ ███████╗██╗███╗   ██╗ █████╗ ██╗
  ╚══██╔══╝██╔══██╗██╔════╝██║████╗  ██║██╔══██╗██║
     ██║   ██████╔╝█████╗  ██║██╔██╗ ██║███████║██║
     ██║   ██╔══██╗██╔══╝  ██║██║╚██╗██║██╔══██║██║
     ██║   ██║  ██║███████╗██║██║ ╚████║██║  ██║███████╗
     ╚═╝   ╚═╝  ╚═╝╚══════╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝
  `);

  // 版本和标语 (左对齐)
  const version = chalk.dim(`v1.0.0`);
  const tagline = isEnglish
    ? chalk.gray(`AI Agent for Solana Token Launchpad`)
    : chalk.gray(`Solana 代币发射平台的 AI Agent`);

  console.log('\n' + textLogo);
  await printImageLogo();
  console.log(tagline);
  console.log(version);
  console.log('');
}

/**
 * 简洁版 Logo（用于 Agent 模式中）
 */
export async function printMiniLogo(lang: 'en' | 'zh' = 'en'): Promise<void> {
  const isEnglish = lang === 'en';

  // 尝试显示图片
  await printImageLogo();

  // 绿色文字 (左对齐)
  const text = chalk.green.bold(`BAGS AGENT OS`);

  const tagline = isEnglish
    ? chalk.gray(`AI Agent for Solana Token Launchpad`)
    : chalk.gray(`Solana 代币发射平台的 AI Agent`);

  console.log(text);
  console.log(tagline);
  console.log('');
}

/**
 * 获取带语言的 Logo
 */
export async function getLogo(lang: 'en' | 'zh' = 'en'): Promise<void> {
  await printLogo({ language: lang });
}