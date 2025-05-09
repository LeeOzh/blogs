# 使用官方 Node.js 镜像
FROM node:22-alpine

# 设置工作目录
WORKDIR /app

# 安装依赖
COPY package.json yarn.lock ./
RUN yarn install --production

# 复制编译后的 dist 文件
COPY dist ./dist
COPY .env .env

# 启动应用
CMD ["node", "dist/main"]
