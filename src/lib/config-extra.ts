// 扩展配置支持 - 从环境变量加载配置

import { loadConfig, setLLMConfig, setBagsConfig, setLanguage, AppConfig } from './config.js';

export function loadConfigFromEnv(): Partial<AppConfig> {
  const result: Partial<AppConfig> = {};

  // LLM 配置
  if (process.env.LLM_BASE_URL || process.env.LLM_API_KEY || process.env.LLM_MODEL) {
    result.llm = {
      baseUrl: process.env.LLM_BASE_URL || 'https://mgallery.haier.net/v1',
      model: process.env.LLM_MODEL || 'MiniMax-M2',
      apiKey: process.env.LLM_API_KEY || '',
    };
  }

  // Bags 配置
  if (process.env.BAGS_API_KEY) {
    result.bags = {
      apiKey: process.env.BAGS_API_KEY,
      jwtToken: process.env.BAGS_JWT_TOKEN || '',
    };
  }

  // 语言
  if (process.env.LANGUAGE) {
    result.language = (process.env.LANGUAGE === 'zh' ? 'zh' : 'en') as 'en' | 'zh';
  }

  return result;
}

// 自动初始化配置
export function autoInitConfig(): void {
  const envConfig = loadConfigFromEnv();
  
  if (envConfig.llm?.apiKey) {
    setLLMConfig(envConfig.llm);
  }
  
  if (envConfig.bags?.apiKey) {
    setBagsConfig(envConfig.bags);
  }
  
  if (envConfig.language) {
    setLanguage(envConfig.language);
  }
}
