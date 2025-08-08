import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Tool, ToolCategory, ToolType, ToolStatus } from '@prisma/client';

export interface ToolWithCategory extends Tool {
  category: ToolCategory;
}

export interface ToolCategoryWithTools extends ToolCategory {
  tools: Tool[];
}

@Injectable()
export class ToolService {
  constructor(private prisma: PrismaService) {}

  // 获取所有工具分类及其工具
  async getToolsWithCategories(): Promise<ToolCategoryWithTools[]> {
    return this.prisma.toolCategory.findMany({
      include: {
        tools: {
          where: {
            status: {
              not: ToolStatus.DISABLED,
            },
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

  // 获取单个工具详情
  async getToolById(id: number): Promise<ToolWithCategory | null> {
    return this.prisma.tool.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });
  }

  // 记录工具点击
  async recordToolClick(id: number): Promise<Tool> {
    return this.prisma.tool.update({
      where: { id },
      data: {
        clickCount: {
          increment: 1,
        },
      },
    });
  }

  // 获取热门工具
  async getPopularTools(limit: number = 10): Promise<ToolWithCategory[]> {
    return this.prisma.tool.findMany({
      where: {
        status: ToolStatus.ACTIVE,
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

  // 搜索工具
  async searchTools(query: string): Promise<ToolWithCategory[]> {
    return this.prisma.tool.findMany({
      where: {
        AND: [
          {
            status: {
              not: ToolStatus.DISABLED,
            },
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

  // 管理员功能：创建工具分类
  async createToolCategory(data: {
    name: string;
    icon?: string;
    sortOrder?: number;
  }): Promise<ToolCategory> {
    return this.prisma.toolCategory.create({
      data,
    });
  }

  // 管理员功能：创建工具
  async createTool(data: {
    name: string;
    description: string;
    icon?: string;
    categoryId: number;
    color?: string;
    componentName?: string;
    url?: string;
    type?: ToolType;
    status?: ToolStatus;
    sortOrder?: number;
  }): Promise<Tool> {
    return this.prisma.tool.create({
      data,
    });
  }

  // 管理员功能：更新工具
  async updateTool(
    id: number,
    data: Partial<{
      name: string;
      description: string;
      icon: string;
      categoryId: number;
      color: string;
      componentName: string;
      url: string;
      type: ToolType;
      status: ToolStatus;
      sortOrder: number;
    }>,
  ): Promise<Tool> {
    return this.prisma.tool.update({
      where: { id },
      data,
    });
  }

  // 管理员功能：删除工具
  async deleteTool(id: number): Promise<Tool> {
    return this.prisma.tool.delete({
      where: { id },
    });
  }
}