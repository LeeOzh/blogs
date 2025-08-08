# 🚀 服务器部署和数据库迁移指南

## 📋 迁移概述

我们为博客系统添加了工具和网站管理功能，需要进行以下迁移操作：

### 🆕 新增内容：
- 4个新数据库表：`tool_categories`, `tools`, `website_categories`, `websites`
- 3个新枚举类型：`ToolType`, `ToolStatus`, `WebsiteStatus`
- 2个新后端模块：`ToolModule`, `WebsiteModule`
- 新的API接口：`/api/tools/*`, `/api/websites/*`

## 🗄️ 数据库迁移步骤

### 1. 备份现有数据库
```bash
# 备份当前数据库
pg_dump -h localhost -U your_username -d blogdb > backup_$(date +%Y%m%d_%H%M%S).sql

# 或者使用 Docker 备份
docker exec your_postgres_container pg_dump -U your_username blogdb > backup_$(date +%Y%m%d_%H%M%S).sql
```

### 2. 更新代码到服务器
```bash
# 拉取最新代码
git pull origin main

# 或者上传文件到服务器
scp -r blogs-backend/ user@your-server:/path/to/your/project/
scp -r blogs-frontend/ user@your-server:/path/to/your/project/
```

### 3. 后端依赖安装
```bash
cd blogs-backend
npm install
```

### 4. 生成 Prisma 客户端
```bash
# 生成新的 Prisma 客户端（包含新的数据模型）
npx prisma generate
```

### 5. 运行数据库迁移
```bash
# 创建并应用迁移
npx prisma migrate deploy

# 如果是开发环境，可以使用：
# npx prisma migrate dev --name add-tools-and-websites
```

### 6. 初始化新数据
```bash
# 运行 seed 脚本，添加工具和网站的初始数据
npm run db:seed
```

## 🔧 服务器环境配置

### 1. 环境变量检查
确保 `.env` 文件包含必要的配置：

```env
# 数据库连接
DATABASE_URL="postgresql://username:password@localhost:5432/blogdb"

# 服务端口
PORT=3000

# 其他环境变量...
```

### 2. 前端环境配置
更新前端的环境变量：

```env
# 生产环境
VITE_API_URL=https://your-domain.com

# 或开发环境
VITE_API_URL=http://localhost:3000
```

## 🚀 部署步骤

### 方案一：传统部署

#### 后端部署：
```bash
cd blogs-backend

# 安装依赖
npm install

# 生成 Prisma 客户端
npx prisma generate

# 运行迁移
npx prisma migrate deploy

# 初始化数据
npm run db:seed

# 构建项目
npm run build

# 启动服务（使用 PM2）
pm2 start dist/main.js --name "blogs-backend"

# 或者直接启动
npm run start:prod
```

#### 前端部署：
```bash
cd blogs-frontend

# 安装依赖
npm install

# 构建项目
npm run build

# 部署到 Nginx 或其他 Web 服务器
cp -r dist/* /var/www/html/
```

### 方案二：Docker 部署

#### 1. 更新 Docker Compose（如果使用）
```yaml
version: '3.8'
services:
  backend:
    build: ./blogs-backend
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/blogdb
    depends_on:
      - db
    volumes:
      - ./blogs-backend:/app
    command: >
      sh -c "npx prisma generate &&
             npx prisma migrate deploy &&
             npm run db:seed &&
             npm run start:prod"

  frontend:
    build: ./blogs-frontend
    ports:
      - "8080:80"
    environment:
      - VITE_API_URL=http://localhost:3000

  db:
    image: postgres:13
    environment:
      - POSTGRES_DB=blogdb
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

#### 2. 运行 Docker 部署
```bash
# 构建并启动服务
docker-compose up --build -d

# 查看日志
docker-compose logs -f
```

## 🔍 迁移验证

### 1. 检查数据库表
```sql
-- 连接数据库并检查新表是否创建成功
\dt

-- 检查工具分类表
SELECT * FROM tool_categories;

-- 检查工具表
SELECT * FROM tools;

-- 检查网站分类表
SELECT * FROM website_categories;

-- 检查网站表
SELECT * FROM websites;
```

### 2. 测试 API 接口
```bash
# 测试工具接口
curl http://your-domain.com/api/tools

# 测试网站接口
curl http://your-domain.com/api/websites

# 测试点击记录
curl -X POST http://your-domain.com/api/tools/1/click
```

### 3. 前端功能验证
- 访问工具页面：`http://your-domain.com/tools`
- 检查工具和网站是否正常显示
- 测试 Tab 切换功能
- 验证点击统计功能

## 🚨 常见问题和解决方案

### 1. 迁移失败
```bash
# 如果迁移失败，可以重置数据库（谨慎操作）
npx prisma migrate reset --force

# 然后重新运行迁移和 seed
npx prisma migrate deploy
npm run db:seed
```

### 2. 权限问题
```bash
# 确保数据库用户有足够权限
GRANT ALL PRIVILEGES ON DATABASE blogdb TO your_username;
GRANT ALL ON SCHEMA public TO your_username;
```

### 3. 端口冲突
```bash
# 检查端口占用
netstat -tulpn | grep :3000

# 杀死占用端口的进程
kill -9 PID
```

### 4. Prisma 客户端问题
```bash
# 重新生成客户端
rm -rf node_modules/.prisma
npx prisma generate
```

## 📊 数据迁移验证清单

- [ ] 数据库备份完成
- [ ] 代码更新到服务器
- [ ] 后端依赖安装成功
- [ ] Prisma 客户端生成成功
- [ ] 数据库迁移执行成功
- [ ] Seed 数据初始化完成
- [ ] 后端服务启动正常
- [ ] 前端构建部署成功
- [ ] API 接口测试通过
- [ ] 前端功能验证通过
- [ ] 工具页面显示正常
- [ ] 点击统计功能正常

## 🔄 回滚方案

如果迁移出现问题，可以使用以下回滚方案：

### 1. 数据库回滚
```bash
# 恢复数据库备份
psql -h localhost -U your_username -d blogdb < backup_YYYYMMDD_HHMMSS.sql
```

### 2. 代码回滚
```bash
# 回滚到之前的版本
git checkout previous_commit_hash

# 重新部署
npm run build
pm2 restart blogs-backend
```

## 📈 性能优化建议

### 1. 数据库索引
```sql
-- 为常用查询字段添加索引
CREATE INDEX idx_tools_status ON tools(status);
CREATE INDEX idx_tools_category_id ON tools(category_id);
CREATE INDEX idx_websites_status ON websites(status);
CREATE INDEX idx_websites_category_id ON websites(category_id);
```

### 2. 缓存配置
考虑为工具和网站列表添加缓存，减少数据库查询。

### 3. CDN 配置
将前端静态资源部署到 CDN，提升加载速度。

完成以上步骤后，你的博客系统就成功升级了工具和网站管理功能！