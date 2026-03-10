import Conf from 'conf';

export type Language = 'en' | 'zh';

export interface LLMConfig {
  baseUrl: string;
  model: string;
  apiKey: string;
}

export interface BagsConfig {
  apiKey: string;
  jwtToken?: string;
  moltbookUsername?: string;
}

export interface AppConfig {
  llm?: LLMConfig;
  bags?: BagsConfig;
  language?: Language;
}

const store = new Conf<AppConfig>({
  projectName: 'bags-agent',
  defaults: {
    llm: {
      baseUrl: 'https://api.openai.com/v1',
      model: 'gpt-4',
      apiKey: '',
    },
    bags: {
      apiKey: '',
      jwtToken: '',
      moltbookUsername: '',
    },
    language: 'en',
  },
});

export function loadConfig(): AppConfig {
  return {
    llm: store.get('llm'),
    bags: store.get('bags'),
  };
}

export function saveConfig(config: Partial<AppConfig>): void {
  if (config.llm) {
    store.set('llm', { ...store.get('llm'), ...config.llm });
  }
  if (config.bags) {
    store.set('bags', { ...store.get('bags'), ...config.bags });
  }
}

export function setLLMConfig(config: LLMConfig): void {
  store.set('llm', config);
}

export function setBagsConfig(config: BagsConfig): void {
  store.set('bags', config);
}

export function getLLMConfig(): LLMConfig | undefined {
  return store.get('llm');
}

export function getBagsConfig(): BagsConfig | undefined {
  return store.get('bags');
}

export function getLanguage(): Language {
  return store.get('language') || 'en';
}

export function setLanguage(lang: Language): void {
  store.set('language', lang);
}

export function clearConfig(): void {
  store.clear();
}

export { store };