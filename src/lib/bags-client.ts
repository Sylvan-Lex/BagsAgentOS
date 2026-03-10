import { getBagsConfig } from './config.js';

const BASE_URL = 'https://public-api-v2.bags.fm/api/v1';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface Wallet {
  address: string;
  publicKey: string;
}

export interface ClaimablePosition {
  mint: string;
  tokenSymbol: string;
  claimableAmount: number;
}

export interface TradeQuote {
  inAmount: string;
  outAmount: string;
  priceImpact: string;
}

export interface TokenInfo {
  name: string;
  symbol: string;
  metadataUri: string;
}

export interface FeeShareConfig {
  payer: string;
  baseMint: string;
  feeClaimers: Array<{
    user: string;
    userBps: number;
  }>;
}

export class BagsClient {
  private apiKey: string = '';
  private jwtToken: string = '';

  /**
   * 初始化客户端
   */
  init(): void {
    const config = getBagsConfig();
    if (!config?.apiKey) {
      throw new Error('Bags API Key 未配置。请运行 bags config:set-bags --api-key <key>');
    }
    this.apiKey = config.apiKey;
    this.jwtToken = config.jwtToken || '';
  }

  /**
   * 发送 API 请求
   */
  private async request<T>(
    endpoint: string,
    options: {
      method?: string;
      body?: any;
      requireAuth?: boolean;
      requireApiKey?: boolean;
    } = {}
  ): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (options.requireApiKey !== false) {
      headers['x-api-key'] = this.apiKey;
    }

    if (options.requireAuth && this.jwtToken) {
      headers['Authorization'] = `Bearer ${this.jwtToken}`;
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: options.method || 'GET',
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API Error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  // ===== 认证相关 =====

  /**
   * 初始化认证会话
   */
  async initAuth(username: string): Promise<{ postId: string }> {
    return this.request('/agent/auth/init', {
      method: 'POST',
      body: { agentUsername: username },
      requireApiKey: false,
    });
  }

  /**
   * 完成登录获取 JWT
   */
  async login(username: string, postId: string): Promise<{ token: string }> {
    return this.request('/agent/auth/login', {
      method: 'POST',
      body: { agentUsername: username, postId },
      requireApiKey: false,
    });
  }

  /**
   * 创建 API Key
   */
  async createDevKey(name: string): Promise<{ apiKey: string }> {
    return this.request('/agent/dev/keys/create', {
      method: 'POST',
      body: { token: this.jwtToken, name },
    });
  }

  // ===== 钱包相关 =====

  /**
   * 列出钱包
   */
  async listWallets(): Promise<{ wallets: Wallet[] }> {
    return this.request('/agent/wallet/list', {
      method: 'POST',
      body: { token: this.jwtToken },
    });
  }

  /**
   * 导出私钥（注意：返回的是加密后的私钥，需要解密）
   */
  async exportWallet(walletAddress: string): Promise<{ encryptedPrivateKey: string }> {
    return this.request('/agent/wallet/export', {
      method: 'POST',
      body: { token: this.jwtToken, wallet: walletAddress },
    });
  }

  // ===== 费用相关 =====

  /**
   * 获取可领取费用
   */
  async getClaimablePositions(wallet: string): Promise<{ positions: ClaimablePosition[] }> {
    return this.request(`/token-launch/claimable-positions?wallet=${wallet}`, {
      requireAuth: false,
    });
  }

  /**
   * 领取费用
   */
  async claimFees(
    wallet: string,
    positions: Array<{ mint: string; amount: number }>
  ): Promise<{ transactions: string[] }> {
    return this.request('/token-launch/claim-txs/v3', {
      method: 'POST',
      body: { wallet, positions },
    });
  }

  /**
   * 获取代币总费用
   */
  async getLifetimeFees(mint: string): Promise<{ totalFees: number }> {
    return this.request(`/token-launch/lifetime-fees?mint=${mint}`, {
      requireAuth: false,
    });
  }

  // ===== 交易相关 =====

  /**
   * 获取交易报价
   */
  async getQuote(
    fromMint: string,
    toMint: string,
    amount: number
  ): Promise<TradeQuote> {
    return this.request(
      `/trade/quote?fromMint=${fromMint}&toMint=${toMint}&amount=${amount}`,
      { requireAuth: false }
    );
  }

  /**
   * 执行交易
   */
  async swap(
    wallet: string,
    quote: TradeQuote
  ): Promise<{ transaction: string; signature: string }> {
    return this.request('/trade/swap', {
      method: 'POST',
      body: { wallet, quote },
    });
  }

  // ===== 代币发射 =====

  /**
   * 创建代币信息
   */
  async createTokenInfo(tokenInfo: TokenInfo): Promise<{ tokenInfoId: string }> {
    return this.request('/token-launch/create-token-info', {
      method: 'POST',
      body: tokenInfo,
    });
  }

  /**
   * 配置费用分成
   */
  async configFeeShare(config: FeeShareConfig): Promise<{ configId: string }> {
    return this.request('/fee-share/config', {
      method: 'POST',
      body: config,
    });
  }

  /**
   * 创建发射交易
   */
  async createLaunchTransaction(
    tokenInfo: TokenInfo,
    feeShareConfig: FeeShareConfig
  ): Promise<{ transaction: string }> {
    return this.request('/token-launch/create-launch-transaction', {
      method: 'POST',
      body: { tokenInfo, feeShareConfig },
    });
  }

  /**
   * 查询其他身份钱包
   */
  async lookupWallet(
    provider: 'moltbook' | 'twitter' | 'github',
    username: string
  ): Promise<{ wallet: string }> {
    return this.request(
      `/token-launch/fee-share/wallet/v2?provider=${provider}&username=${username}`,
      { requireAuth: false }
    );
  }

  // ===== 区块链 =====

  /**
   * 发送已签名交易
   */
  async sendTransaction(transaction: string): Promise<{ signature: string }> {
    return this.request('/solana/send-transaction', {
      method: 'POST',
      body: { transaction },
    });
  }

  /**
   * 检查是否已配置
   */
  isConfigured(): boolean {
    const config = getBagsConfig();
    return !!config?.apiKey;
  }
}

// 导出单例
export const bagsClient = new BagsClient();