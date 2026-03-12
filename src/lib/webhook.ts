// Webhook 通知模块

export interface WebhookPayload {
  event: string;
  data: any;
  timestamp: number;
}

export class WebhookClient {
  private url: string = '';

  setUrl(url: string): void {
    this.url = url;
  }

  async notify(event: string, data: any): Promise<void> {
    if (!this.url) return;

    const payload: WebhookPayload = {
      event,
      data,
      timestamp: Date.now(),
    };

    try {
      await fetch(this.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.error('Webhook failed:', err);
    }
  }

  // 便捷方法
  async onTransaction(signature: string, status: string): Promise<void> {
    await this.notify('transaction', { signature, status });
  }

  async onTokenLaunch(tokenAddress: string, name: string): Promise<void> {
    await this.notify('token_launch', { tokenAddress, name });
  }

  async onError(error: string, context: string): Promise<void> {
    await this.notify('error', { error, context });
  }
}

export const webhookClient = new WebhookClient();
