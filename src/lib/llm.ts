import Anthropic from '@anthropic-ai/sdk';
import { getLLMConfig } from './config.js';
import { Readable } from 'stream';

export interface LLMMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface LLMStreamCallback {
  (chunk: string): void;
}

export class LLMClient {
  private client: Anthropic | null = null;

  /**
   * 初始化 LLM 客户端
   */
  init(): void {
    const config = getLLMConfig();
    if (!config?.apiKey) {
      throw new Error('LLM API Key 未配置。请运行 bags config:set --api-key <key>');
    }

    // 处理 baseUrl，确保不会重复追加 /v1
    let baseUrl = config.baseUrl || 'https://api.anthropic.com';
    // 移除末尾的斜杠
    baseUrl = baseUrl.replace(/\/$/, '');
    // 移除末尾的 /v1 或 /v1/，因为 SDK 会自动添加
    baseUrl = baseUrl.replace(/\/v1\/?$/, '');

    this.client = new Anthropic({
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
    const response = await this.client!.messages.create({
      model: config?.model || 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      system: systemPrompt,
      messages: messages as any,
    });

    return response.content[0].type === 'text'
      ? response.content[0].text
      : '';
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

    const stream = await this.client!.messages.stream({
      model: config?.model || 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      system: systemPrompt,
      messages: messages as any,
    });

    for await (const chunk of stream) {
      if (chunk.type === 'content_block_delta') {
        if (chunk.delta.type === 'text_delta') {
          callback(chunk.delta.text);
        }
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