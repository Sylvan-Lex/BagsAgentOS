# BagsAgentOS 优化版

基于 [原版](https://github.com/Sylvan-Lex/BagsAgentOS) 优化

## 功能特点

- 🤖 **AI 对话**: 使用 MiniMax-M2 模型
- 💰 **Bags API 集成**: 代币发射和交易
- 🌐 **多语言**: 支持中英文
- 💻 **交互式 CLI**: 友好的终端体验

## 快速开始

### 安装
```bash
# 1. 进入目录
cd BagsAgentOS

# 2. 安装依赖
npm install

# 3. 构建
npm run build

# 4. 链接 (可选)
npm link
```

### 配置 (可选 - 已预置默认配置)
```bash
# 查看配置
bags config:show

# 配置 Bags API (可选)
bags config:set-bags --api-key <your-bags-api-key>
```

### 启动 Agent
```bash
bags agent
```

## Agent 命令

在 Agent 模式下使用:

```
/help     - 显示帮助
/config   - 显示配置
/llm      - 设置 LLM
/bags     - 设置 Bags API
/lang     - 设置语言 (en/zh)
/clear    - 清除聊天记录
/wallets  - 查看钱包
/fees     - 查看可领取费用
/exit     - 退出
```

## 示例

```
> Launch a dog meme coin called $PupBag with 8.8 billion supply
> 帮我发一个猫咪主题的代币
> Check my royalty balance
```

## 配置说明

| 配置项 | 默认值 |
|--------|--------|
| Base URL | https://mgallery.haier.net/v1 |
| Model | MiniMax-M2 |
| API Key | sk-vuhfPzH48FWJRcOL1494CbC686C44b16865fA29636621cEf |

如需修改,运行:
```bash
bags config:set --base-url <url> --model <model> --api-key <key>
```

或进入 Agent 后输入:
```
/llm
```

## 相关链接

- [Bags 平台](https://bags.fm/)
- [API 文档](https://docs.bags.fm/)
- [原版项目](https://github.com/Sylvan-Lex/BagsAgentOS)
