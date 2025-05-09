FROM node:22-alpine

WORKDIR /app

# 拷贝依赖文件并安装
COPY package.json yarn.lock ./
RUN yarn install

# 拷贝 Prisma 文件并生成客户端
COPY .env .env
RUN npx prisma generate

# 拷贝源代码并构建项目
COPY tsconfig*.json ./
COPY src ./src
RUN yarn build

# 启动 Nest 应用
CMD ["node", "dist/main"]
