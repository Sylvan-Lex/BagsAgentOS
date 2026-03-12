# BagsAgentOS 🤖

Solana 代币发射平台 AI Agent

[中文](README.zh.md) | [English](README.md)

[![npm version](https://img.shields.io/npm/v/bags-agent)](https://www.npmjs.com/package/bags-agent)
[![License](https://img.shields.io/github/license/Sylvan-Lex/BagsAgentOS)](LICENSE)

[Bags 平台](https://bags.fm/) · [API 文档](https://docs.bags.fm/) · [开发者门户](https://dev.bags.fm/)

---

## ✨ 功能特点

- 🤖 **AI Agent** - 自然语言交互执行代币操作
- 💰 **代币发射** - 在 Solana 上创建新代币
- 🔄 **交易** - 通过 Jupiter 聚合器交换代币
- 💎 **费用管理** - 领取累积的版税
- 🌐 **多语言** - 支持中英文
- ⚡ **OpenAI SDK** - 兼容任何 OpenAI 兼容的 LLM

---

## 🚀 快速开始

```bash
# 克隆并安装
git clone https://github.com/Sylvan-Lex/BagsAgentOS.git
cd BagsAgentOS
npm install
npm run build

# 运行
bags agent
```

---

## 📖 命令列表

### 核心命令

| 命令 | 说明 |
|------|------|
| `bags agent` | 启动交互式 AI Agent |
| `bags status` | 检查系统状态 |
| `bags version` | 显示版本信息 |

### 配置命令

| 命令 | 说明 |
|------|------|
| `bags config:show` | 显示当前配置 |
| `bags config:init` | 交互式配置向导 |
| `bags config:set` | 设置 LLM 配置 |
| `bags config:set-bags` | 设置 Bags API Key |
| `bags config:export` | 导出/导入配置 |

### 钱包操作

| 命令 | 说明 |
|------|------|
| `bags wallet:list` | 列出关联钱包 |
| `bags wallet:balance` | 查看钱包余额 |

### 代币操作

| 命令 | 说明 |
|------|------|
| `bags launch:token` | 发射新代币 |
| `bags tokens:popular` | 常用代币列表 |
| `bags search:token` | 按提供商搜索代币 |

### 交易

| 命令 | 说明 |
|------|------|
| `bags trade:swap` | 交换代币 |

### 费用管理

| 命令 | 说明 |
|------|------|
| `bags claim:fees` | 领取可领取费用 |

---

## 🤖 Agent 模式命令

运行 `bags agent` 后，使用以下命令：

```
/help     - 显示帮助
/config   - 显示配置
/llm      - 设置 LLM
/bags     - 设置 Bags API
/lang     - 设置语言 (en/zh)
/clear    - 清除历史
/wallets  - 列出钱包
/balance  - 查看余额
/fees     - 查看费用
/quote    - 获取报价
/exit     - 退出
```

### 使用示例

```
> 发射一个狗狗币叫 $PupBag
> 查看我的版税余额并领取
> 把 1 SOL 换成 USDC
> Launch a dog coin called $PupBag
```

---

## ⚙️ 配置

默认 LLM 已预配置 (MiniMax-M2):

```
Base URL: https://mgallery.haier.net/v1
Model: MiniMax-M2
```

### 自定义 LLM

```bash
bags config:set --base-url <url> --model <model> --api-key <key>
```

或在 Agent 模式下：
```
/llm
```

### Bags API Key

```bash
bags config:set-bags --api-key <your-bags-key>
```

或在 Agent 模式下：
```
/bags <your-api-key>
```

---

## 💻 使用示例

### 查看系统状态

```bash
$ bags status

🔍 系统状态检查

LLM:
  ✓ 已配置
    URL: https://mgallery.haier.net/v1
    Model: MiniMax-M2
  ✓ 连接成功

Bags:
  ⚠ 未配置 (可选)
```

### 列出钱包

```bash
$ bags wallet:list

钱包列表:
  YourWalletAddress...
```

### 获取兑换报价

```bash
$ bags trade:swap --from So11111111111111111111111111111111111111112 --to EPjFWdd5AufqSSCwM1X5RUor4S6veMA2FVFkGPz8Srtv --amount 1
```

### 发射代币

```bash
$ bags launch:token --name "我的代币" --symbol MTK --supply 1000000000
```

### 交互式 Agent

```bash
$ bags agent

BAGS AGENT OS
AI Agent for Solana Token Launchpad
✓ 配置检查通过

> 发射一个狗狗币
```

---

## 🔧 开发

```bash
npm run build    # 构建 TypeScript
npm run dev      # 开发模式
bags --help      # 显示帮助
```

---

## 📁 项目结构

```
BagsAgentOS/
├── bin/
│   └── run.cjs          # 可执行文件
├── src/
│   ├── commands/        # CLI 命令
│   │   ├── agent/       # Agent 模式
│   │   ├── claim/       # 领取费用
│   │   ├── config/      # 配置
│   │   ├── launch/      # 代币发射
│   │   ├── search/      # 代币搜索
│   │   ├── tokens/      # 代币列表
│   │   ├── trade/       # 交易
│   │   └── wallet/      # 钱包操作
│   └── lib/             # 库
│       ├── bags-client.ts
│       ├── llm.ts
│       ├── config.ts
│       ├── utils.ts
│       └── ...
├── EXAMPLES.md          # 示例
└── package.json
```

---

## 📄 许可证

MIT

---

## 🔗 相关链接

- [Bags 平台](https://bags.fm/)
- [API 文档](https://docs.bags.fm/)
- [开发者门户](https://dev.bags.fm/)
- [GitHub](https://github.com/Sylvan-Lex/BagsAgentOS)
