# BagsAgentOS 🤖

AI Agent for Solana Token Launchpad

[中文](README.zh.md) | [English](README.md)

[![npm version](https://img.shields.io/npm/v/bags-agent)](https://www.npmjs.com/package/bags-agent)
[![License](https://img.shields.io/github/license/Sylvan-Lex/BagsAgentOS)](LICENSE)

[Bags Platform](https://bags.fm/) · [API Docs](https://docs.bags.fm/) · [Dev Portal](https://dev.bags.fm/)

---

## ✨ Features

- 🤖 **AI Agent** - Natural language interaction for token operations
- 💰 **Token Launch** - Create new tokens on Solana
- 🔄 **Trading** - Swap tokens via Jupiter aggregator
- 💎 **Fee Management** - Claim accumulated royalties
- 🌐 **Multi-language** - English and Chinese support
- ⚡ **OpenAI SDK** - Compatible with any OpenAI-compatible LLM

---

## 🚀 Quick Start

```bash
# Clone & Install
git clone https://github.com/Sylvan-Lex/BagsAgentOS.git
cd BagsAgentOS
npm install
npm run build

# Run
bags agent
```

---

## 📖 Commands

### Core Commands

| Command | Description |
|---------|-------------|
| `bags agent` | Start interactive AI Agent |
| `bags status` | Check system status |
| `bags version` | Show version info |

### Configuration

| Command | Description |
|---------|-------------|
| `bags config:show` | Show current config |
| `bags config:init` | Interactive setup wizard |
| `bags config:set` | Set LLM config |
| `bags config:set-bags` | Set Bags API Key |
| `bags config:export` | Export/import config |

### Wallet Operations

| Command | Description |
|---------|-------------|
| `bags wallet:list` | List connected wallets |
| `bags wallet:balance` | Check wallet balance |

### Token Operations

| Command | Description |
|---------|-------------|
| `bags launch:token` | Launch new token |
| `bags tokens:popular` | Show popular tokens |
| `bags search:token` | Search token by provider |

### Trading

| Command | Description |
|---------|-------------|
| `bags trade:swap` | Swap tokens |

### Fee Management

| Command | Description |
|---------|-------------|
| `bags claim:fees` | Claim accumulated fees |

---

## 🤖 Agent Mode Commands

After running `bags agent`, use these commands:

```
/help     - Show this help message
/config   - Show current configuration
/llm      - Set LLM configuration
/bags     - Set Bags API Key
/lang     - Set language (en/zh)
/clear    - Clear chat history
/wallets  - List connected wallets
/balance  - Check wallet balance
/fees     - Check claimable fees
/quote    - Get swap quote
/exit     - Exit the agent
```

### Examples

```
> Launch a dog meme coin called $PupBag with 8.8 billion supply
> Check my royalty balance and claim fees
> Swap 1 SOL to USDC
> 帮我发一个猫咪主题的代币
```

---

## ⚙️ Configuration

Default LLM is pre-configured (MiniMax-M2):

```
Base URL: https://mgallery.haier.net/v1
Model: MiniMax-M2
```

### Customize LLM

```bash
bags config:set --base-url <url> --model <model> --api-key <key>
```

Or in Agent mode:
```
/llm
```

### Bags API Key

```bash
bags config:set-bags --api-key <your-bags-key>
```

Or in Agent mode:
```
/bags <your-api-key>
```

---

## 💻 Examples

### Check System Status

```bash
$ bags status

🔍 System Status Check

LLM:
  ✓ Configured
    URL: https://mgallery.haier.net/v1
    Model: MiniMax-M2
  ✓ Connection OK

Bags:
  ⚠ Not configured (optional)
```

### List Wallets

```bash
$ bags wallet:list

Wallets:
  YourWalletAddress...
```

### Get Swap Quote

```bash
$ bags trade:swap --from So11111111111111111111111111111111111111112 --to EPjFWdd5AufqSSCwM1X5RUor4S6veMA2FVFkGPz8Srtv --amount 1
```

### Launch Token

```bash
$ bags launch:token --name "My Token" --symbol MTK --supply 1000000000
```

### Interactive Agent

```bash
$ bags agent

BAGS AGENT OS
AI Agent for Solana Token Launchpad
✓ Configuration check passed

> Launch a dog coin called $PupBag
```

---

## 🔧 Development

```bash
npm run build    # Build TypeScript
npm run dev      # Dev mode
bags --help      # Show help
```

---

## 📁 Project Structure

```
BagsAgentOS/
├── bin/
│   └── run.cjs          # Executable
├── src/
│   ├── commands/        # CLI commands
│   │   ├── agent/       # Agent mode
│   │   ├── claim/       # Fee claims
│   │   ├── config/      # Configuration
│   │   ├── launch/      # Token launch
│   │   ├── search/      # Token search
│   │   ├── tokens/      # Token lists
│   │   ├── trade/       # Trading
│   │   └── wallet/      # Wallet ops
│   └── lib/             # Libraries
│       ├── bags-client.ts
│       ├── llm.ts
│       ├── config.ts
│       ├── utils.ts
│       └── ...
├── EXAMPLES.md          # Examples
└── package.json
```

---

## 📄 License

MIT

---

## 🔗 Links

- [Bags Platform](https://bags.fm/)
- [API Documentation](https://docs.bags.fm/)
- [Developer Portal](https://dev.bags.fm/)
- [GitHub](https://github.com/Sylvan-Lex/BagsAgentOS)
