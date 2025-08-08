import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Website, WebsiteCategory, WebsiteStatus } from '@prisma/client';

export interface WebsiteWithCategory extends Website {
  category: WebsiteCategory;
}

export interface WebsiteCategoryWithWebsites extends WebsiteCategory {
  websites: Website[];
}

@Injectable()
export class WebsiteService {
  constructor(private prisma: PrismaService) {}

  // 获取所有网站分类及其网站
  async getWebsitesWithCategories(): Promise<WebsiteCategoryWithWebsites[]> {
    return this.prisma.websiteCategory.findMany({
      include: {
        websites: {
          where: {
            status: WebsiteStatus.ACTIVE,
          },
          orderBy: [
            { sortOrder: 'asc' },
            { createdAt: 'desc' },
          ],
        },
      },
      orderBy: [
        { sortOrder: 'asc' },
        { createdAt: 'asc' },
      ],
    });
  }

  // 获取单个网站详情
  async getWebsiteById(id: number): Promise<WebsiteWithCategory | null> {
    return this.prisma.website.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });
  }

  // 记录网站点击
  async recordWebsiteClick(id: number): Promise<Website> {
    return this.prisma.website.update({
      where: { id },
      data: {
        clickCount: {
          increment: 1,
        },
      },
    });
  }

  // 获取热门网站
  async getPopularWebsites(limit: number = 10): Promise<WebsiteWithCategory[]> {
    return this.prisma.website.findMany({
      where: {
        status: WebsiteStatus.ACTIVE,
      },
      include: {
        category: true,
      },
      orderBy: {
        clickCount: 'desc',
      },
      take: limit,
    });
  }

  // 搜索网站
  async searchWebsites(query: string): Promise<WebsiteWithCategory[]> {
    return this.prisma.website.findMany({
      where: {
        AND: [
          {
            status: WebsiteStatus.ACTIVE,
          },
          {
            OR: [
              {
                name: {
                  contains: query,
                  mode: 'insensitive',
                },
              },
              {
                description: {
                  contains: query,
                  mode: 'insensitive',
                },
              },
            ],
          },
        ],
      },
      include: {
        category: true,
      },
      orderBy: [
        { clickCount: 'desc' },
        { sortOrder: 'asc' },
      ],
    });
  }

  // 管理员功能：创建网站分类
  async createWebsiteCategory(data: {
    name: string;
    icon?: string;
    sortOrder?: number;
  }): Promise<WebsiteCategory> {
    return this.prisma.websiteCategory.create({
      data,
    });
  }

  // 管理员功能：创建网站
  async createWebsite(data: {
    name: string;
    description: string;
    icon?: string;
    categoryId: number;
    color?: string;
    url: string;
    sortOrder?: number;
    status?: WebsiteStatus;
  }): Promise<Website> {
    return this.prisma.website.create({
      data,
    });
  }

  // 管理员功能：更新网站
  async updateWebsite(
    id: number,
    data: Partial<{
      name: string;
      description: string;
      icon: string;
      categoryId: number;
      color: string;
      url: string;
      sortOrder: number;
      status: WebsiteStatus;
    }>,
  ): Promise<Website> {
    return this.prisma.website.update({
      where: { id },
      data,
    });
  }

  // 管理员功能：删除网站
  async deleteWebsite(id: number): Promise<Website> {
    return this.prisma.website.delete({
      where: { id },
    });
  }
}