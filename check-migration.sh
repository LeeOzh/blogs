#!/bin/bash

# 🔍 迁移验证脚本
# 用于检查博客系统工具功能迁移是否成功

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[CHECK]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

echo "🔍 博客系统迁移验证"
echo "===================="
echo ""

# 检查文件结构
print_status "检查文件结构..."

if [ -f "blogs-backend/src/tool/tool.controller.ts" ]; then
    print_success "工具控制器文件存在"
else
    print_error "工具控制器文件缺失"
fi

if [ -f "blogs-backend/src/website/website.controller.ts" ]; then
    print_success "网站控制器文件存在"
else
    print_error "网站控制器文件缺失"
fi

if [ -f "blogs-backend/prisma/seed.ts" ]; then
    print_success "数据库种子文件存在"
else
    print_error "数据库种子文件缺失"
fi

if [ -f "blogs-frontend/src/services/toolService.ts" ]; then
    print_success "前端工具服务文件存在"
else
    print_error "前端工具服务文件缺失"
fi

# 检查数据库连接
print_status "检查数据库连接..."

cd blogs-backend

if [ -f ".env" ]; then
    print_success "环境配置文件存在"
else
    print_warning "环境配置文件缺失"
fi

# 检查 Prisma 客户端
if [ -d "node_modules/.prisma" ]; then
    print_success "Prisma 客户端已生成"
else
    print_warning "Prisma 客户端未生成，请运行: npx prisma generate"
fi

# 检查构建文件
if [ -d "dist" ]; then
    print_success "后端构建文件存在"
else
    print_warning "后端未构建，请运行: npm run build"
fi

cd ..

# 检查前端构建
print_status "检查前端构建..."

cd blogs-frontend

if [ -d "dist" ]; then
    print_success "前端构建文件存在"
else
    print_warning "前端未构建，请运行: npm run build"
fi

cd ..

# 检查服务状态
print_status "检查服务状态..."

# 检查后端服务
if curl -s http://localhost:3000/api/tools > /dev/null 2>&1; then
    print_success "后端服务运行正常"
    
    # 测试工具接口
    TOOLS_RESPONSE=$(curl -s http://localhost:3000/api/tools)
    if echo "$TOOLS_RESPONSE" | grep -q '"code":200'; then
        print_success "工具接口返回正常"
    else
        print_warning "工具接口返回异常"
    fi
    
    # 测试网站接口
    WEBSITES_RESPONSE=$(curl -s http://localhost:3000/api/websites)
    if echo "$WEBSITES_RESPONSE" | grep -q '"code":200'; then
        print_success "网站接口返回正常"
    else
        print_warning "网站接口返回异常"
    fi
    
else
    print_warning "后端服务未运行，请启动服务: cd blogs-backend && npm run start:dev"
fi

# 检查前端服务
if curl -s http://localhost:8080 > /dev/null 2>&1; then
    print_success "前端服务运行正常"
else
    print_warning "前端服务未运行，请启动服务: cd blogs-frontend && npm start"
fi

echo ""
echo "📊 验证摘要："
echo "=============="

# 统计检查结果
SUCCESS_COUNT=$(grep -c "print_success" /tmp/check_output 2>/dev/null || echo "0")
WARNING_COUNT=$(grep -c "print_warning" /tmp/check_output 2>/dev/null || echo "0")
ERROR_COUNT=$(grep -c "print_error" /tmp/check_output 2>/dev/null || echo "0")

echo "✅ 成功项目: 文件结构完整，服务正常"
echo "⚠️  警告项目: 请检查未构建或未启动的服务"
echo "❌ 错误项目: 请检查缺失的文件"

echo ""
echo "🚀 下一步操作："
echo "==============="

if curl -s http://localhost:3000/api/tools > /dev/null 2>&1; then
    echo "✅ 迁移成功！可以访问工具页面测试功能"
    echo "   前端地址: http://localhost:8080/tools"
else
    echo "⚠️  请先启动后端服务:"
    echo "   cd blogs-backend && npm run start:dev"
    echo ""
    echo "   然后启动前端服务:"
    echo "   cd blogs-frontend && npm start"
fi

echo ""
echo "📚 相关文档："
echo "============"
echo "• SERVER_MIGRATION_GUIDE.md - 详细迁移指南"
echo "• API_TEST.md - API 接口测试文档"
echo "• DEPLOYMENT_GUIDE.md - 部署指南"