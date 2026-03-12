import OpenAI from 'openai';
import { getLLMConfig } from './config.js';
import { Readable } from 'stream';

export interface LLMMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface LLMStreamCallback {
  (chunk: string): void;
}

export class LLMClient {
  private client: OpenAI | null = null;

  /**
   * 初始化 LLM 客户端
   */
  init(): void {
    const config = getLLMConfig();
    if (!config?.apiKey) {
      throw new Error('LLM API Key 未配置。请运行 bags config:set --api-key <key>');
    }

    // 处理 baseUrl，确保不会重复追加 /v1
    let baseUrl = config.baseUrl || 'https://api.openai.com/v1';
    // 移除末尾的斜杠
    baseUrl = baseUrl.replace(/\/$/, '');
    // 如果没有 /v1，添加它
    if (!baseUrl.endsWith('/v1')) {
      baseUrl = baseUrl + '/v1';
    }

    this.client = new OpenAI({
      apiKey: config.apiKey,
      baseURL: baseUrl,
    });
  }

  /**
   * 发送消息并获取响应
   */
  async sendMessage(
    messages: LLMMessage[],
    systemPrompt?: string
  ): Promise<string> {
    if (!this.client) {
      this.init();
    }

    const config = getLLMConfig();
    
    // 构建消息列表
    const chatMessages: any[] = [];
    if (systemPrompt) {
      chatMessages.push({ role: 'system', content: systemPrompt });
    }
    chatMessages.push(...messages);

    const response = await this.client!.chat.completions.create({
      model: config?.model || 'MiniMax-M2',
      max_tokens: 4096,
      messages: chatMessages,
    });

    return response.choices[0]?.message?.content || '';
  }

  /**
   * 发送消息并流式输出
   */
  async sendMessageStream(
    messages: LLMMessage[],
    callback: LLMStreamCallback,
    systemPrompt?: string
  ): Promise<void> {
    if (!this.client) {
      this.init();
    }

    const config = getLLMConfig();

    // 构建消息列表
    const chatMessages: any[] = [];
    if (systemPrompt) {
      chatMessages.push({ role: 'system', content: systemPrompt });
    }
    chatMessages.push(...messages);

    const stream = await this.client!.chat.completions.create({
      model: config?.model || 'MiniMax-M2',
      max_tokens: 4096,
      messages: chatMessages,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        callback(content);
      }
    }
  }

  /**
   * 检查是否已配置
   */
  isConfigured(): boolean {
    const config = getLLMConfig();
    return !!(config?.apiKey && config?.baseUrl && config?.model);
  }
}

// 导出单例
export const llmClient = new LLMClient();
