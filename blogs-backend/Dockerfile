FROM node:22-alpine

WORKDIR /app

# 拷贝依赖文件并安装
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# 拷贝 Prisma 文件并生成客户端
COPY prisma ./prisma
COPY .env .env
RUN npx prisma generate

# 拷贝源代码并构建项目
COPY tsconfig*.json ./
COPY src ./src
RUN yarn build

# 开放端口
EXPOSE 3000

# 启动 Nest 应用
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]

