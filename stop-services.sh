#!/bin/bash

# ⏹️ 停止服务脚本
# 用于停止博客系统的前后端服务

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

echo "⏹️ 停止博客系统服务"
echo "=================="
echo ""

# 从 PID 文件读取进程 ID
if [ -f ".backend.pid" ]; then
    BACKEND_PID=$(cat .backend.pid)
    print_status "停止后端服务 (PID: $BACKEND_PID)..."
    
    if kill -0 "$BACKEND_PID" 2>/dev/null; then
        kill "$BACKEND_PID"
        print_success "后端服务已停止"
    else
        print_error "后端服务进程不存在或已停止"
    fi
    
    rm -f .backend.pid
else
    print_status "未找到后端 PID 文件，尝试通过端口停止..."
    
    # 通过端口查找并停止进程
    BACKEND_PID=$(lsof -ti:3000 2>/dev/null)
    if [ -n "$BACKEND_PID" ]; then
        kill "$BACKEND_PID"
        print_success "通过端口停止后端服务 (PID: $BACKEND_PID)"
    else
        print_status "未找到运行在 3000 端口的进程"
    fi
fi

# 停止前端服务
if [ -f ".frontend.pid" ]; then
    FRONTEND_PID=$(cat .frontend.pid)
    print_status "停止前端服务 (PID: $FRONTEND_PID)..."
    
    if kill -0 "$FRONTEND_PID" 2>/dev/null; then
        kill "$FRONTEND_PID"
        print_success "前端服务已停止"
    else
        print_error "前端服务进程不存在或已停止"
    fi
    
    rm -f .frontend.pid
else
    print_status "未找到前端 PID 文件，尝试通过端口停止..."
    
    # 通过端口查找并停止进程
    FRONTEND_PID=$(lsof -ti:8080 2>/dev/null)
    if [ -n "$FRONTEND_PID" ]; then
        kill "$FRONTEND_PID"
        print_success "通过端口停止前端服务 (PID: $FRONTEND_PID)"
    else
        print_status "未找到运行在 8080 端口的进程"
    fi
fi

# 额外清理：停止所有相关的 Node.js 进程
print_status "清理相关进程..."

# 查找并停止可能的 npm/node 进程
pkill -f "npm run start:dev" 2>/dev/null && print_success "停止了 npm run start:dev 进程"
pkill -f "npm start" 2>/dev/null && print_success "停止了 npm start 进程"

echo ""
print_success "🎉 所有服务已停止！"
echo ""
echo "📋 清理完成："
echo "============="
echo "• 后端服务已停止"
echo "• 前端服务已停止"
echo "• PID 文件已清理"
echo "• 相关进程已清理"
echo ""
echo "🚀 重新启动服务："
echo "================="
echo "• 使用 ./start-services.sh 重新启动所有服务"
echo "• 或手动启动："
echo "  - 后端: cd blogs-backend && npm run start:dev"
echo "  - 前端: cd blogs-frontend && npm start"