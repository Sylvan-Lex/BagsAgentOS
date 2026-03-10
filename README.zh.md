# Bags CLI（原名 BagsAgentOS）

![Bags Agent 启动界面](assets/bags-agent-start.png)

**Bags CLI** 是一个开源的命令行工具 + AI Agent，专为 Solana 上最受欢迎的创作者优先 Launchpad —— **Bags** 平台打造。

### Bags 平台简介

https://bags.fm/ 是一个零代码 Solana 代币发射平台，允许任何人快速创建 meme币/项目代币，**创建者永久从每笔交易中抽取 1% 的版税（royalty）**。平台数据亮眼：

- 创建者累计收益 **3100万美元+**
- 总交易量 **50亿美元+**
- 已资助项目 **25万个+**

相比 pump.fun 等平台，Bags 更注重创作者的长期收益。

Bags CLI 把这一切搬到命令行 + AI 加持：自动化发射、可脚本化、对话式操作，再也不用一直刷网页。

### 交互式 AI Agent

运行 `bags agent:start` 进入对话模式：

```
BAGS AGENT OS
Solana Token Launchpad AI Agent
✓ 配置检查通过
> 请输入你的问题或指令，按 Enter 发送...
```

支持中英文自然语言：

```
> 帮我发射一个狗狗主题 meme 币，名字 $PupBag，总量 88亿
> 创建猫咪主题代币 $NekoBag，供应量10亿，简介：猫咪在吃包子超可爱
> 查询我的版税余额并领取
```

### 核心功能

- 对话式 AI Agent：创建代币、交易、领取版税、查看数据
- 启动时自动检查配置（钱包、RPC、API Key）
- 完整对接 Bags 官方 API（https://docs.bags.fm/）
- 本地优先、适合开发者 / 批量 / 自动化场景
- 未来规划：多钱包管理、自动狙击新币、批量发射、社交媒体自动发帖等

### 快速开始

```bash
# 1. 克隆仓库
git clone https://github.com/Sylvan-Lex/BagsAgentOS.git
cd BagsAgentOS

# 2. 安装依赖（需要 Node.js + npm）
npm install

# 3. 全局链接
npm link

# 4. 配置 LLM 和 Bags API Key
bags config:set --base-url <你的LLM接口地址> --model <模型名称> --api-key <你的LLM密钥>
bags config:set-bags --api-key <你的Bags-API-Key>

# 5. 启动 AI Agent
bags agent
```

### 命令列表

```bash
# 配置命令
bags config:set --base-url <url> --model <model> --api-key <key>
bags config:set-bags --api-key <key>
bags config:show
bags config:init
bags config:lang --language <en|zh>

# Agent 模式
bags agent        # 启动交互式 AI Agent
```

### 相关链接

- Bags 平台：https://bags.fm/
- 官方 API 文档：https://docs.bags.fm/
- 开发者门户（申请 API Key）：https://dev.bags.fm/
- GitHub 仓库：https://github.com/Sylvan-Lex/BagsAgentOS

---

项目刚启动（非常早期），欢迎 star / fork / 提 issue / PR！
一起把 Solana Launchpad 的效率卷到飞起！