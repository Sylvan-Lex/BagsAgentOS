import { Hook } from '@oclif/core';
import { printMiniLogo } from '../lib/logo.js';
import { getLanguage } from '../lib/config.js';

const hook: Hook<'init'> = async function (opts) {
  // 获取语言设置
  const lang = getLanguage() || 'en';

  // 只在没有指定命令时打印 logo (即运行 bags 不带参数)
  if (!opts.argv || opts.argv.length === 0) {
    await printMiniLogo(lang);
  }
};

export default hook;