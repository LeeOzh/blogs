FROM node:22-alpine

WORKDIR /app

# 拷贝依赖文件并安装
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# 拷贝 Prisma 文件并生成客户端
COPY prisma ./prisma
COPY .env .env
RUN npx prisma generate

# ✅ 拷贝 Nest 构建配置文件
COPY nest-cli.json ./

# 拷贝 tsconfig 和源代码
COPY tsconfig*.json ./
COPY src ./src

# 构建项目
RUN yarn build

# 开放端口
EXPOSE 3000

# 启动 Nest 应用
CMD ["node", "dist/src/main"]
