-- CreateEnum
CREATE TYPE "ToolType" AS ENUM ('INTERNAL', 'EXTERNAL');

-- CreateEnum
CREATE TYPE "ToolStatus" AS ENUM ('ACTIVE', 'DEVELOPING', 'DISABLED');

-- CreateEnum
CREATE TYPE "WebsiteStatus" AS ENUM ('ACTIVE', 'DISABLED');

-- CreateTable
CREATE TABLE "tool_categories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tool_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tools" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT,
    "categoryId" INTEGER NOT NULL,
    "color" TEXT,
    "componentName" TEXT,
    "url" TEXT,
    "type" "ToolType" NOT NULL DEFAULT 'INTERNAL',
    "status" "ToolStatus" NOT NULL DEFAULT 'DEVELOPING',
    "clickCount" INTEGER NOT NULL DEFAULT 0,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tools_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "website_categories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "website_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "websites" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT,
    "categoryId" INTEGER NOT NULL,
    "color" TEXT,
    "url" TEXT NOT NULL,
    "clickCount" INTEGER NOT NULL DEFAULT 0,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "status" "WebsiteStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "websites_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tool_categories_name_key" ON "tool_categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "website_categories_name_key" ON "website_categories"("name");

-- AddForeignKey
ALTER TABLE "tools" ADD CONSTRAINT "tools_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "tool_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "websites" ADD CONSTRAINT "websites_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "website_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
