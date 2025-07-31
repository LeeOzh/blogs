# 🔧 AI图片风格转换故障排除指南

## 常见错误及解决方案

### 1. 权限错误
```
"This authentication method does not have sufficient permissions"
```

**原因**: Token权限不足
**解决方案**:
1. 访问 https://huggingface.co/settings/tokens
2. 删除现有token
3. 创建新token时选择 **"Write"** 权限
4. 更新.env文件中的token
5. 重启开发服务器

### 2. 参数错误
```
"FluxPipeline.__call__() got an unexpected keyword argument 'image'"
```

**原因**: 模型不支持传入的参数
**解决方案**: 已修复，现在使用简化的API调用

### 3. 模型加载中
```
"Model is currently loading"
```

**原因**: 模型正在初始化
**解决方案**: 等待几分钟后重试，或系统会自动尝试其他模型

### 4. 服务不可用
```
"Service Unavailable (503)"
```

**原因**: Hugging Face服务暂时不可用
**解决方案**: 
- 稍后重试
- 系统会自动尝试备用模型
- 考虑配置Replicate作为备用

## 🔍 调试步骤

### 第一步: 检查配置
1. 确认.env文件存在且包含正确的token
2. Token格式应该是: `hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
3. 重启开发服务器

### 第二步: 使用调试面板
1. 访问 `/#/style-transfer`
2. 查看"调试面板"部分
3. 点击"测试API连接"按钮
4. 根据测试结果进行相应处理

### 第三步: 检查浏览器控制台
1. 打开浏览器开发者工具 (F12)
2. 查看Console标签页的错误信息
3. 查看Network标签页的API请求详情

## 🚀 推荐配置

### 开发环境
```env
# .env文件
VITE_HUGGINGFACE_TOKEN=hf_your_write_permission_token_here
```

### 生产环境
```env
# .env文件
VITE_HUGGINGFACE_TOKEN=hf_your_write_permission_token_here
VITE_REPLICATE_TOKEN=r8_your_replicate_token_here
```

## 📊 模型选择策略

系统会按以下顺序尝试模型:
1. `runwayml/stable-diffusion-v1-5` (最兼容)
2. `CompVis/stable-diffusion-v1-4` (备用)
3. `stabilityai/stable-diffusion-2-1` (高质量)

如果所有模型都失败，会显示详细的错误信息。

## 🔄 切换到Replicate

如果Hugging Face持续出现问题，可以切换到Replicate:

1. 注册 https://replicate.com/
2. 获取API token
3. 在.env中添加: `VITE_REPLICATE_TOKEN=r8_your_token`
4. 系统会自动优先使用Replicate

## 💡 性能优化建议

1. **图片大小**: 上传前压缩图片到合理大小
2. **网络环境**: 确保网络连接稳定
3. **并发限制**: 避免同时发起多个请求
4. **缓存**: 相同的提示词会产生相似结果

## 📞 获取帮助

如果问题仍然存在:
1. 检查Hugging Face服务状态
2. 查看模型页面是否有特殊要求
3. 考虑使用不同的模型
4. 联系技术支持

## 🎯 成功标志

当一切正常工作时，你应该看到:
- ✅ "AI服务已就绪" 状态指示
- ✅ 调试面板显示 "API测试成功"
- ✅ 能够成功生成图片
- ✅ 处理时间在合理范围内 (30-120秒)