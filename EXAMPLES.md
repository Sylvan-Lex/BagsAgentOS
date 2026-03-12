# BagsAgentOS 使用示例

## 快速开始

```bash
# 安装
cd BagsAgentOS
npm install
npm run build
npm link  # 可选

# 查看状态
bags status

# 启动交互式 Agent
bags agent
```

## 命令示例

### 1. 配置 (首次使用)

```bash
# 方式1: 交互式初始化
bags config:init

# 方式2: 命令行配置
bags config:set --base-url https://mgallery.haier.net/v1 --model MiniMax-M2 --api-key <your-key>
bags config:set-bags --api-key <your-bags-key>
```

### 2. 钱包操作

```bash
# 列出钱包
bags wallet:list

# 查看余额
bags wallet:balance
bags wallet:balance --wallet <address>
```

### 3. 代币操作

```bash
# 发射新代币
bags launch:token --name "My Token" --symbol MTK --supply 1000000000

# 或交互式
bags launch:token
```

### 4. 交易

```bash
# 交换代币 (获取报价)
bags trade:swap --from So11111111111111111111111111111111111111112 --to EPjFWdd5AufqSSCwM1X5RUor4S6veMA2FVFkGPz8Srtv --amount 0.1

# 或交互式
bags trade:swap
```

### 5. 费用管理

```bash
# 查看可领取费用
bags claim:fees

# 指定钱包
bags claim:fees --wallet <address>
```

### 6. Agent 模式

```bash
# 启动交互式 AI Agent
bags agent

# 在 Agent 中可以使用自然语言
> Launch a token called Doge
> Check my balance
> Swap 1 SOL to USDC
> Claim my fees
```

## Agent 命令 (在 / 下)

| 命令 | 说明 |
|------|------|
| `/help` | 显示帮助 |
| `/config` | 显示配置 |
| `/llm` | 设置 LLM |
| `/bags` | 设置 Bags API |
| `/lang` | 设置语言 |
| `/clear` | 清除历史 |
| `/wallets` | 列出钱包 |
| `/balance` | 查看余额 |
| `/fees` | 查看费用 |
| `/quote` | 获取报价 |
| `/exit` | 退出 |

## 常用代币 Mint

- SOL: `So11111111111111111111111111111111111111112`
- USDC: `EPjFWdd5AufqSSCwM1X5RUor4S6veMA2FVFkGPz8Srtv`
- USDT: `Es9vMFrzaCERmJfrF4H2FY4WDGWEmNPG9XFvJQVwc1eu` (需确认)

## 故障排除

```bash
# 查看详细状态
bags status

# 查看配置
bags config:show
```

## 获取帮助

```bash
# 查看所有命令
bags --help

# 查看特定命令帮助
bags agent --help
bags launch:token --help
bags trade:swap --help
```
