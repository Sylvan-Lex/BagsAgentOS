import chalk from 'chalk';

export class Logger {
  private isZh: boolean;

  constructor(isZh: boolean = false) {
    this.isZh = isZh;
  }

  info(msg: string): void {
    console.log(chalk.gray(msg));
  }

  success(msg: string): void {
    console.log(chalk.green('✓ ' + msg));
  }

  error(msg: string): void {
    console.log(chalk.red('✗ ' + msg));
  }

  warn(msg: string): void {
    console.log(chalk.yellow('⚠ ' + msg));
  }

  debug(msg: string): void {
    if (process.env.DEBUG) {
      console.log(chalk.gray('[DEBUG] ' + msg));
    }
  }

  section(title: string): void {
    console.log(chalk.bold('\n' + title + '\n'));
  }

  keyValue(key: string, value: string): void {
    console.log(chalk.gray(`  ${key}: `) + chalk.white(value));
  }
}

export const createLogger = (isZh: boolean = false) => new Logger(isZh);
