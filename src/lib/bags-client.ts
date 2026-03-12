import { getBagsConfig } from './config.js';

const BASE_URL = 'https://public-api-v2.bags.fm/api/v1';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface Wallet {
  address: string;
  publicKey: string;
  createdAt?: string;
}

export interface ClaimablePosition {
  mint: string;
  tokenSymbol: string;
  claimableAmount: number;
  tokenName?: string;
}

export interface TradeQuote {
  inAmount: string;
  outAmount: string;
  priceImpact: string;
  fromMint: string;
  toMint: string;
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

export interface TokenLaunchResult {
  tokenAddress: string;
  signature: string;
}

export class BagsClient {
  private apiKey: string = '';
  private jwtToken: string = '';

  init(): void {
    const config = getBagsConfig();
    if (!config?.apiKey) {
      throw new Error('Bags API Key 未配置。请运行 bags config:set-bags --api-key <key>');
    }
    this.apiKey = config.apiKey;
    this.jwtToken = config.jwtToken || '';
  }

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

    const url = endpoint.includes('?') ? `${BASE_URL}${endpoint}` : `${BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
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

  // ===== 认证 =====
  async initAuth(username: string): Promise<{ postId: string }> {
    return this.request('/agent/auth/init', {
      method: 'POST',
      body: { agentUsername: username },
      requireApiKey: false,
    });
  }

  async login(username: string, postId: string): Promise<{ token: string }> {
    return this.request('/agent/auth/login', {
      method: 'POST',
      body: { agentUsername: username, postId },
      requireApiKey: false,
    });
  }

  async createDevKey(name: string): Promise<{ apiKey: string }> {
    return this.request('/agent/dev/keys/create', {
      method: 'POST',
      body: { token: this.jwtToken, name },
    });
  }

  // ===== 钱包 =====
  async listWallets(): Promise<{ wallets: Wallet[] }> {
    return this.request('/agent/wallet/list', {
      method: 'POST',
      body: { token: this.jwtToken },
    });
  }

  async exportWallet(walletAddress: string): Promise<{ encryptedPrivateKey: string }> {
    return this.request('/agent/wallet/export', {
      method: 'POST',
      body: { token: this.jwtToken, wallet: walletAddress },
    });
  }

  async getBalance(walletAddress: string): Promise<{ sol: number; tokens: any[] }> {
    return this.request('/agent/wallet/balance', {
      method: 'POST',
      body: { token: this.jwtToken, wallet: walletAddress },
    });
  }

  // ===== 费用 =====
  async getClaimablePositions(wallet: string): Promise<{ positions: ClaimablePosition[] }> {
    return this.request(`/token-launch/claimable-positions?wallet=${wallet}`, {
      requireAuth: false,
    });
  }

  async claimFees(
    wallet: string,
    positions: Array<{ mint: string; amount: number }>
  ): Promise<{ transactions: string[] }> {
    return this.request('/token-launch/claim-txs/v3', {
      method: 'POST',
      body: { wallet, positions },
    });
  }

  async getLifetimeFees(mint: string): Promise<{ totalFees: number }> {
    return this.request(`/token-launch/lifetime-fees?mint=${mint}`, {
      requireAuth: false,
    });
  }

  // ===== 交易 =====
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
  async createTokenInfo(tokenInfo: TokenInfo): Promise<{ tokenInfoId: string }> {
    return this.request('/token-launch/create-token-info', {
      method: 'POST',
      body: tokenInfo,
    });
  }

  async configFeeShare(config: FeeShareConfig): Promise<{ configId: string }> {
    return this.request('/fee-share/config', {
      method: 'POST',
      body: config,
    });
  }

  async createLaunchTransaction(
    tokenInfo: TokenInfo,
    feeShareConfig: FeeShareConfig
  ): Promise<{ transaction: string }> {
    return this.request('/token-launch/create-launch-transaction', {
      method: 'POST',
      body: { tokenInfo, feeShareConfig },
    });
  }

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
  async sendTransaction(transaction: string): Promise<{ signature: string }> {
    return this.request('/solana/send-transaction', {
      method: 'POST',
      body: { transaction },
    });
  }

  // ===== 工具 =====
  isConfigured(): boolean {
    const config = getBagsConfig();
    return !!config?.apiKey;
  }
}

export const bagsClient = new BagsClient();
