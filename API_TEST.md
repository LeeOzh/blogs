# 🧪 API 接口测试文档

## 📋 接口返回结构统一

所有接口现在都使用统一的返回结构，与现有的 post 接口保持一致：

```typescript
{
  code: number,    // 状态码：200 成功，404 未找到，500 服务器错误
  data: any,       // 返回数据
  msg: string      // 返回消息
}
```

## 🛠️ 工具相关接口

### 1. 获取工具列表
```http
GET /api/tools
```

**返回示例：**
```json
{
  "code": 200,
  "data": [
    {
      "id": 1,
      "name": "生活工具",
      "icon": "🏠",
      "sortOrder": 1,
      "tools": [
        {
          "id": 1,
          "name": "牛马粮食计算器",
          "description": "实时计算工资收入，让你知道每分每秒都在赚钱",
          "icon": "💰",
          "color": "from-green-400 to-blue-500",
          "componentName": "SalaryCalculator",
          "type": "INTERNAL",
          "status": "ACTIVE",
          "clickCount": 0
        }
      ]
    }
  ],
  "msg": "success"
}
```

### 2. 记录工具点击
```http
POST /api/tools/:id/click
```

**返回示例：**
```json
{
  "code": 200,
  "data": "success",
  "msg": "点击记录成功"
}
```

### 3. 获取热门工具
```http
GET /api/tools/popular/list?limit=10
```

### 4. 搜索工具
```http
GET /api/tools/search/query?q=计算器
```

## 🌐 网站相关接口

### 1. 获取网站列表
```http
GET /api/websites
```

**返回示例：**
```json
{
  "code": 200,
  "data": [
    {
      "id": 1,
      "name": "开发平台",
      "icon": "🚀",
      "sortOrder": 1,
      "websites": [
        {
          "id": 1,
          "name": "GitHub",
          "description": "全球最大的代码托管平台，开发者必备",
          "icon": "🐙",
          "color": "from-gray-700 to-gray-900",
          "url": "https://github.com",
          "status": "ACTIVE",
          "clickCount": 0
        }
      ]
    }
  ],
  "msg": "success"
}
```

### 2. 记录网站点击
```http
POST /api/websites/:id/click
```

## 🔧 测试步骤

### 1. 启动后端服务
```bash
cd blogs-backend
npm run start:dev
```

### 2. 测试接口
使用 Postman 或 curl 测试：

```bash
# 获取工具列表
curl http://localhost:3000/api/tools

# 获取网站列表
curl http://localhost:3000/api/websites

# 记录工具点击
curl -X POST http://localhost:3000/api/tools/1/click

# 记录网站点击
curl -X POST http://localhost:3000/api/websites/1/click
```

### 3. 启动前端应用
```bash
cd blogs-frontend
npm start
```

### 4. 验证功能
- 访问工具页面，查看是否正确显示工具和网站
- 点击工具和网站，验证点击统计是否正常
- 检查浏览器控制台是否有错误

## 🐛 常见问题

### 1. 数据库连接问题
确保 PostgreSQL 服务正在运行，并且 `.env` 文件中的 `DATABASE_URL` 配置正确。

### 2. 端口冲突
- 后端默认端口：3000
- 前端默认端口：8080
- 确保端口没有被其他服务占用

### 3. CORS 问题
后端已配置 CORS 允许前端访问：
```typescript
app.enableCors({
  origin: 'http://localhost:8080',
  credentials: true,
})
```

### 4. 数据为空
如果接口返回空数据，运行 seed 脚本初始化数据：
```bash
cd blogs-backend
npm run db:seed
```

## ✅ 验证清单

- [ ] 后端服务启动成功
- [ ] 数据库连接正常
- [ ] seed 数据初始化完成
- [ ] 工具列表接口返回数据
- [ ] 网站列表接口返回数据
- [ ] 点击统计功能正常
- [ ] 前端页面显示正常
- [ ] 无控制台错误

完成以上验证后，工具和网站管理系统就可以正常使用了！