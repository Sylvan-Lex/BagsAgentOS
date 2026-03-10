# BagsAgentOS 实现计划

## 项目概述

开发一个类似 Claude Code 的 CLI Agent，支持：
1. 交互式 CLI 界面（类似 Claude Code）
2. 配置 LLM（支持自定义 baseurl、model、apiKey）
3. 配置 Bags API Key
4. 执行 Bags 相关操作（代币发射、交易、费用领取等）
5. 启动时打印 Bags Logo

---

## 技术选型

| 组件 | 技术 | 理由 |
|------|------|------|
| CLI 框架 | oclif | Claude Code 使用，功能完善，支持自动补全 |
| 编程语言 | TypeScript | 与 Claude Code 保持一致 |
| LLM 客户端 | @anthropic-ai/sdk | 官方 SDK，支持自定义 baseUrl |
| API HTTP 客户端 | undici / axios | 高性能 HTTP 请求 |
| 配置存储 | conf | 简单易用的 JSON 配置管理 |
| CLI 彩色输出 | chalk | 成熟的终端着色库 |
| 终端 UI | inquirer | 交互式命令行界面 |

---

## 功能分解

### 1. CLI 启动与 Logo 显示
- [ ] 创建 oclif 项目结构
- [ ] 添加 Bags ASCII Logo（从 PNG 转换）
- [ ] 实现启动时 Logo 打印
- [ ] 配置命令别名（如 `bags`）

### 2. 配置管理
- [ ] `config:set` 命令 - 设置 LLM 配置（baseUrl, model, apiKey）
- [ ] `config:set-bags` 命令 - 设置 Bags API Key
- [ ] `config:show` 命令 - 显示当前配置
- [ ] `config:init` 命令 - 交互式配置初始化
- [ ] 配置存储位置：`~/.config/bags-agent/`

### 3. LLM 集成
- [ ] 实现 LLM 客户端封装
- [ ] 支持自定义 baseUrl（兼容 OpenAI 兼容 API）
- [ ] 支持流式输出
- [ ] 实现 CLI REPL 循环

### 4. Bags API 客户端
- [ ] 实现认证模块（JWT Token 管理）
- [ ] 钱包管理（list, export）
- [ ] 费用管理（claimable, claim）
- [ ] 交易功能（quote, swap）
- [ ] 代币发射（create-token, fee-share, launch）

### 5. 交互式 Agent 模式
- [ ] REPL 循环实现
- [ ] 自然语言理解意图
- [ ] 调用 Bags API 执行操作
- [ ] 返回结果给用户

---

## 实现步骤

### Phase 1: 项目基础架构

```
bags-agent/
├── src/
│   ├── commands/
│   │   ├── config/
│   │   │   ├── set.ts
│   │   │   ├── set-bags.ts
│   │   │   └── show.ts
│   │   ├── agent/
│   │   │   └── start.ts
│   │   └── index.ts
│   ├── lib/
│   │   ├── logo.ts
│   │   ├── config.ts
│   │   ├── llm.ts
│   │   └── bags-client.ts
│   └── index.ts
├── bin/
│   └── run
├── package.json
└── tsconfig.json
```

### Phase 2: 核心模块

1. **config.ts** - 配置管理
   - 读取/写入配置到 `~/.config/bags-agent/config.json`
   - 支持 LLM 和 Bags 配置

2. **logo.ts** - Logo 打印
   - 使用 ASCII Art 打印 Bags Logo
   - 使用 chalk 着色

3. **llm.ts** - LLM 客户端
   - 封装 @anthropic-ai/sdk
   - 支持自定义 baseUrl
   - 流式输出支持

4. **bags-client.ts** - Bags API 客户端
   - 实现所有 Bags API 端点
   - 错误处理和重试逻辑

### Phase 3: CLI 命令

1. **config:set** - 设置 LLM 配置
   ```bash
   bags config:set --base-url <url> --model <model> --api-key <key>
   ```

2. **config:set-bags** - 设置 Bags API Key
   ```bash
   bags config:set-bags --api-key <key>
   ```

3. **config:show** - 显示配置
   ```bash
   bags config:show
   ```

4. **agent:start** - 启动 Agent 交互模式
   ```bash
   bags agent
   bags agent start
   ```

### Phase 4: Agent REPL

- 打印 Logo（每次启动）
- 等待用户输入
- 解析意图
- 调用相应 API
- 输出结果
- 支持 Ctrl+C 退出

---

## 使用流程

```bash
# 1. 初始化配置（首次使用）
bags config:init

# 或手动配置
bags config:set --base-url https://api.openai.com/v1 --model gpt-4 --api-key sk-xxx
bags config:set-bags --api-key bags_xxx

# 2. 启动 Agent
bags agent

# 3. 在 Agent 中执行操作
# > 发射名为 MyToken 的代币
# > 查看我的钱包余额
# > 领取所有可领取的费用
```

---

## 配置文件格式

`~/.config/bags-agent/config.json`:
```json
{
  "llm": {
    "baseUrl": "https://api.openai.com/v1",
    "model": "gpt-4",
    "apiKey": "sk-xxx"
  },
  "bags": {
    "apiKey": "bags_xxx",
    "jwtToken": "optional_jwt_token"
  }
}
```

---

## Bags API 端点参考

基于 skill 文档：

| 功能 | 端点 | 方法 |
|------|------|------|
| 初始化认证 | /agent/auth/init | POST |
| 完成登录 | /agent/auth/login | POST |
| 创建 API Key | /agent/dev/keys/create | POST |
| 列出钱包 | /agent/wallet/list | POST |
| 导出私钥 | /agent/wallet/export | POST |
| 可领取费用 | /token-launch/claimable-positions | GET |
| 领取费用 | /token-launch/claim-txs/v3 | POST |
| 交易报价 | /trade/quote | GET |
| 执行交易 | /trade/swap | POST |
| 创建代币信息 | /token-launch/create-token-info | POST |
| 配置费用分成 | /fee-share/config | POST |
| 创建发射交易 | /token-launch/create-launch-transaction | POST |
| 发送交易 | /solana/send-transaction | POST |

---

## 风险与注意事项

1. **私钥安全**: 绝不存储私钥到配置文件，只存储钱包地址
2. **API Key 安全**: 使用加密存储或提示用户注意安全
3. **错误处理**: 所有 API 调用需要完善的错误处理
4. **速率限制**: 遵守 Bags API 速率限制（1000/小时）

---

## 验证清单

- [ ] Logo 正确显示
- [ ] 配置正确保存和读取
- [ ] LLM 可以正常调用（流式输出正常）
- [ ] Bags API 各个端点正常工作
- [ ] Agent REPL 可以正常交互
- [ ] 错误信息友好

---

*创建时间: 2026-03-09*