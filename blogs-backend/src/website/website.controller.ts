import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { WebsiteService } from './website.service';
import { WebsiteStatus } from '@prisma/client';

@Controller('websites')
export class WebsiteController {
  constructor(private readonly websiteService: WebsiteService) {}

  // 获取所有网站分类及其网站
  @Get()
  async getWebsites() {
    try {
      const categories = await this.websiteService.getWebsitesWithCategories();
      return {
        code: 200,
        data: categories,
        msg: 'success',
      };
    } catch (error) {
      return {
        code: 500,
        data: null,
        msg: '获取网站列表失败',
      };
    }
  }

  // 获取单个网站详情
  @Get(':id')
  async getWebsiteById(@Param('id', ParseIntPipe) id: number) {
    try {
      const website = await this.websiteService.getWebsiteById(id);
      if (!website) {
        return {
          code: 404,
          data: null,
          msg: '网站不存在',
        };
      }
      return {
        code: 200,
        data: website,
        msg: 'success',
      };
    } catch (error) {
      return {
        code: 500,
        data: null,
        msg: '获取网站详情失败',
      };
    }
  }

  // 记录网站点击
  @Post(':id/click')
  async recordClick(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.websiteService.recordWebsiteClick(id);
      return {
        code: 200,
        data: 'success',
        msg: '点击记录成功',
      };
    } catch (error) {
      return {
        code: 500,
        data: null,
        msg: '记录点击失败',
      };
    }
  }

  // 获取热门网站
  @Get('popular/list')
  async getPopularWebsites(@Query('limit') limit?: string) {
    try {
      const limitNum = limit ? parseInt(limit, 10) : 10;
      const websites = await this.websiteService.getPopularWebsites(limitNum);
      return {
        code: 200,
        data: websites,
        msg: 'success',
      };
    } catch (error) {
      return {
        code: 500,
        data: null,
        msg: '获取热门网站失败',
      };
    }
  }

  // 搜索网站
  @Get('search/query')
  async searchWebsites(@Query('q') query: string) {
    try {
      if (!query || query.trim().length === 0) {
        return {
          code: 200,
          data: [],
          msg: 'success',
        };
      }
      const websites = await this.websiteService.searchWebsites(query.trim());
      return {
        code: 200,
        data: websites,
        msg: 'success',
      };
    } catch (error) {
      return {
        code: 500,
        data: null,
        msg: '搜索网站失败',
      };
    }
  }

  // 管理员接口：创建网站分类
  @Post('categories')
  async createCategory(
    @Body()
    body: {
      name: string;
      icon?: string;
      sortOrder?: number;
    },
  ) {
    try {
      const category = await this.websiteService.createWebsiteCategory(body);
      return {
        success: true,
        data: category,
        message: '网站分类创建成功',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: '创建网站分类失败',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 管理员接口：创建网站
  @Post('create')
  async createWebsite(
    @Body()
    body: {
      name: string;
      description: string;
      icon?: string;
      categoryId: number;
      color?: string;
      url: string;
      sortOrder?: number;
      status?: WebsiteStatus;
    },
  ) {
    try {
      const website = await this.websiteService.createWebsite(body);
      return {
        success: true,
        data: website,
        message: '网站创建成功',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: '创建网站失败',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 管理员接口：更新网站
  @Put(':id')
  async updateWebsite(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    body: Partial<{
      name: string;
      description: string;
      icon: string;
      categoryId: number;
      color: string;
      url: string;
      sortOrder: number;
      status: WebsiteStatus;
    }>,
  ) {
    try {
      const website = await this.websiteService.updateWebsite(id, body);
      return {
        success: true,
        data: website,
        message: '网站更新成功',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: '更新网站失败',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 管理员接口：删除网站
  @Delete(':id')
  async deleteWebsite(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.websiteService.deleteWebsite(id);
      return {
        success: true,
        message: '网站删除成功',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: '删除网站失败',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}