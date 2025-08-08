#!/bin/bash

# 🚀 快速启动脚本
# 用于启动博客系统的前后端服务

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

echo "🚀 启动博客系统服务"
echo "=================="
echo ""

# 检查是否在正确的目录
if [ ! -d "blogs-backend" ] || [ ! -d "blogs-frontend" ]; then
    print_warning "请在项目根目录执行此脚本"
    exit 1
fi

# 启动后端服务
print_status "启动后端服务..."
cd blogs-backend

# 检查是否需要安装依赖
if [ ! -d "node_modules" ]; then
    print_status "安装后端依赖..."
    npm install
fi

# 检查是否需要生成 Prisma 客户端
if [ ! -d "node_modules/.prisma" ]; then
    print_status "生成 Prisma 客户端..."
    npx prisma generate
fi

# 启动后端服务（后台运行）
print_status "启动后端开发服务器..."
npm run start:dev &
BACKEND_PID=$!

cd ..

# 等待后端启动
print_status "等待后端服务启动..."
sleep 5

# 检查后端是否启动成功
if curl -s http://localhost:3000/api/tools > /dev/null 2>&1; then
    print_success "后端服务启动成功 (PID: $BACKEND_PID)"
else
    print_warning "后端服务可能未完全启动，请稍等片刻"
fi

# 启动前端服务
print_status "启动前端服务..."
cd blogs-frontend

# 检查是否需要安装依赖
if [ ! -d "node_modules" ]; then
    print_status "安装前端依赖..."
    npm install
fi

# 启动前端服务（后台运行）
print_status "启动前端开发服务器..."
npm start &
FRONTEND_PID=$!

cd ..

# 等待前端启动
print_status "等待前端服务启动..."
sleep 8

echo ""
print_success "🎉 服务启动完成！"
echo ""
echo "📋 服务信息："
echo "============="
echo "• 后端服务: http://localhost:3000 (PID: $BACKEND_PID)"
echo "• 前端服务: http://localhost:8080 (PID: $FRONTEND_PID)"
echo ""
echo "🔗 快速链接："
echo "============="
echo "• 首页: http://localhost:8080"
echo "• 工具页面: http://localhost:8080/tools"
echo "• API 文档: http://localhost:3000/api"
echo ""
echo "🛠️ API 测试："
echo "============="
echo "• 工具接口: curl http://localhost:3000/api/tools"
echo "• 网站接口: curl http://localhost:3000/api/websites"
echo ""
echo "⏹️ 停止服务："
echo "============="
echo "• 停止后端: kill $BACKEND_PID"
echo "• 停止前端: kill $FRONTEND_PID"
echo "• 停止所有: kill $BACKEND_PID $FRONTEND_PID"
echo ""

# 保存 PID 到文件，方便后续停止
echo "$BACKEND_PID" > .backend.pid
echo "$FRONTEND_PID" > .frontend.pid

print_status "PID 已保存到 .backend.pid 和 .frontend.pid 文件"
print_status "使用 ./stop-services.sh 可以停止所有服务"

# 等待用户输入来停止服务
echo ""
echo "按 Ctrl+C 停止所有服务，或按 Enter 在后台继续运行..."
read -r

echo "服务将在后台继续运行"
echo "使用 ./stop-services.sh 停止服务"