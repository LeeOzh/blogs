# Hugging Face API 配置指南

## 🚀 快速开始

### 1. 获取Hugging Face API Token

1. 访问 [Hugging Face](https://huggingface.co/)
2. 注册/登录账户
3. 进入 [Settings > Access Tokens](https://huggingface.co/settings/tokens)
4. 点击 "New token"
5. 选择 "Read" 权限（免费用户足够）
6. 复制生成的token

### 2. 配置环境变量

1. 在项目根目录创建 `.env` 文件：
```bash
cp .env.example .env
```

2. 编辑 `.env` 文件，添加你的token：
```env
VITE_HUGGINGFACE_TOKEN=hf_your_token_here
```

### 3. 测试配置

启动开发服务器：
```bash
npm run dev
```

访问 `http://localhost:5173/#/style-transfer`，你应该看到：
- 绿色的"AI服务已就绪 (Hugging Face)"状态指示
- 可以正常上传图片和选择风格

## 📊 免费额度说明

### Hugging Face免费层限制
- **每月1000次请求**
- **速度较慢**（共享资源）
- **可能需要排队**（高峰期）

### 使用建议
- 开发测试阶段使用免费额度
- 生产环境建议升级到付费计划或切换到Replicate

## 🔧 故障排除

### 常见错误

#### 1. "AI服务未配置"
- 检查 `.env` 文件是否存在
- 确认token格式正确（以`hf_`开头）
- 重启开发服务器

#### 2. "HTTP 401: Unauthorized"
- Token可能无效或过期
- 重新生成token并更新配置

#### 3. "HTTP 503: Service Unavailable"
- Hugging Face服务暂时不可用
- 稍后重试或切换到Replicate

#### 4. 处理速度很慢
- 这是免费服务的正常现象
- 考虑升级到付费计划

### 调试技巧

1. 打开浏览器开发者工具
2. 查看Console标签页的错误信息
3. 检查Network标签页的API请求

## 🔄 切换到Replicate（生产环境推荐）

当你准备上线时，可以轻松切换到Replicate：

1. 获取Replicate API token
2. 在 `.env` 中添加：
```env
VITE_REPLICATE_TOKEN=r8_your_token_here
```

3. 系统会自动优先使用Replicate（更稳定、更快）

## 💡 优化建议

### 提升用户体验
- 添加图片压缩（减少上传时间）
- 实现进度条显示
- 添加结果缓存机制

### 成本控制
- 实现用户配额系统
- 添加图片尺寸限制
- 监控API使用量

## 📈 监控使用情况

在Hugging Face控制台可以查看：
- API调用次数
- 剩余免费额度
- 错误率统计

建议定期检查使用情况，避免超出限制。