#!/bin/bash
echo "🔧 BagsAgentOS 开发工具"
echo "Node: $(node --version)"
echo ""
echo "📋 配置:"
node bin/run.cjs config:show
echo ""
echo "📦 构建:"
[ -d "dist" ] && echo "  ✓ 已构建" || npm run build
echo ""
echo "📖 命令:"
node bin/run.cjs --help
