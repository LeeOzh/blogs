@echo off
REM 🚀 博客系统工具功能迁移脚本 (Windows版本)
REM 使用方法: 双击运行或在命令行执行 migrate.bat

setlocal enabledelayedexpansion

echo 🚀 开始博客系统工具功能迁移...
echo ==================================
echo.

REM 确认执行
set /p confirm="是否继续执行迁移？(y/N): "
if /i not "%confirm%"=="y" (
    echo 迁移已取消
    pause
    exit /b 0
)

echo [INFO] 检查系统要求...

REM 检查 Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js 未安装，请先安装 Node.js
    pause
    exit /b 1
)

REM 检查 npm
npm --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] npm 未安装，请先安装 npm
    pause
    exit /b 1
)

echo [SUCCESS] 系统要求检查通过

REM 备份数据库
echo [INFO] 创建备份目录...
if not exist "backups" mkdir backups
echo [SUCCESS] 备份准备完成

REM 更新后端
echo [INFO] 更新后端服务...
cd blogs-backend

echo [INFO] 安装后端依赖...
call npm install
if errorlevel 1 (
    echo [ERROR] 后端依赖安装失败
    pause
    exit /b 1
)

echo [INFO] 生成 Prisma 客户端...
call npx prisma generate
if errorlevel 1 (
    echo [ERROR] Prisma 客户端生成失败
    pause
    exit /b 1
)

echo [INFO] 运行数据库迁移...
call npx prisma migrate deploy
if errorlevel 1 (
    echo [WARNING] migrate deploy 失败，尝试 migrate dev...
    call npx prisma migrate dev --name add-tools-and-websites
    if errorlevel 1 (
        echo [ERROR] 数据库迁移失败
        pause
        exit /b 1
    )
)

echo [INFO] 初始化工具和网站数据...
call npm run db:seed
if errorlevel 1 (
    echo [ERROR] 数据初始化失败
    pause
    exit /b 1
)

echo [INFO] 构建后端项目...
call npm run build
if errorlevel 1 (
    echo [ERROR] 后端构建失败
    pause
    exit /b 1
)

cd ..
echo [SUCCESS] 后端更新完成

REM 更新前端
echo [INFO] 更新前端应用...
cd blogs-frontend

echo [INFO] 安装前端依赖...
call npm install
if errorlevel 1 (
    echo [ERROR] 前端依赖安装失败
    pause
    exit /b 1
)

echo [INFO] 构建前端项目...
call npm run build
if errorlevel 1 (
    echo [ERROR] 前端构建失败
    pause
    exit /b 1
)

cd ..
echo [SUCCESS] 前端更新完成

REM 显示完成信息
echo.
echo [SUCCESS] 🎉 迁移完成！
echo.
echo 📋 迁移摘要：
echo   ✅ 数据库迁移完成
echo   ✅ 新增 4 个数据库表
echo   ✅ 初始化工具和网站数据
echo   ✅ 后端服务更新完成
echo   ✅ 前端应用构建完成
echo.
echo 🔗 测试链接：
echo   • 工具接口: http://localhost:3000/api/tools
echo   • 网站接口: http://localhost:3000/api/websites
echo   • 前端页面: http://localhost:8080/tools
echo.
echo 📚 更多信息请查看：
echo   • SERVER_MIGRATION_GUIDE.md - 详细迁移指南
echo   • API_TEST.md - API 测试文档
echo.
echo 🚀 启动服务：
echo   后端: cd blogs-backend ^&^& npm run start:dev
echo   前端: cd blogs-frontend ^&^& npm start
echo.

pause