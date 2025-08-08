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
import { ToolService } from './tool.service';
import { ToolType, ToolStatus } from '@prisma/client';

@Controller('tools')
export class ToolController {
  constructor(private readonly toolService: ToolService) {}

  // 获取所有工具分类及其工具
  @Get()
  async getTools() {
    try {
      const categories = await this.toolService.getToolsWithCategories();
      return {
        code: 200,
        data: categories,
        msg: 'success',
      };
    } catch (error) {
      throw new HttpException(
        {
          code: 500,
          data: null,
          msg: '获取工具列表失败',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 获取单个工具详情
  @Get(':id')
  async getToolById(@Param('id', ParseIntPipe) id: number) {
    try {
      const tool = await this.toolService.getToolById(id);
      if (!tool) {
        return {
          code: 404,
          data: null,
          msg: '工具不存在',
        };
      }
      return {
        code: 200,
        data: tool,
        msg: 'success',
      };
    } catch (error) {
      return {
        code: 500,
        data: null,
        msg: '获取工具详情失败',
      };
    }
  }

  // 记录工具点击
  @Post(':id/click')
  async recordClick(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.toolService.recordToolClick(id);
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

  // 获取热门工具
  @Get('popular/list')
  async getPopularTools(@Query('limit') limit?: string) {
    try {
      const limitNum = limit ? parseInt(limit, 10) : 10;
      const tools = await this.toolService.getPopularTools(limitNum);
      return {
        code: 200,
        data: tools,
        msg: 'success',
      };
    } catch (error) {
      return {
        code: 500,
        data: null,
        msg: '获取热门工具失败',
      };
    }
  }

  // 搜索工具
  @Get('search/query')
  async searchTools(@Query('q') query: string) {
    try {
      if (!query || query.trim().length === 0) {
        return {
          code: 200,
          data: [],
          msg: 'success',
        };
      }
      const tools = await this.toolService.searchTools(query.trim());
      return {
        code: 200,
        data: tools,
        msg: 'success',
      };
    } catch (error) {
      return {
        code: 500,
        data: null,
        msg: '搜索工具失败',
      };
    }
  }

  // 管理员接口：创建工具分类
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
      const category = await this.toolService.createToolCategory(body);
      return {
        code: 200,
        data: category,
        msg: '工具分类创建成功',
      };
    } catch (error) {
      return {
        code: 500,
        data: null,
        msg: '创建工具分类失败',
      };
    }
  }

  // 管理员接口：创建工具
  @Post('create')
  async createTool(
    @Body()
    body: {
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
    },
  ) {
    try {
      const tool = await this.toolService.createTool(body);
      return {
        code: 200,
        data: tool,
        msg: '工具创建成功',
      };
    } catch (error) {
      return {
        code: 500,
        data: null,
        msg: '创建工具失败',
      };
    }
  }

  // 管理员接口：更新工具
  @Put(':id')
  async updateTool(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    body: Partial<{
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
  ) {
    try {
      const tool = await this.toolService.updateTool(id, body);
      return {
        success: true,
        data: tool,
        message: '工具更新成功',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: '更新工具失败',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 管理员接口：删除工具
  @Delete(':id')
  async deleteTool(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.toolService.deleteTool(id);
      return {
        success: true,
        message: '工具删除成功',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: '删除工具失败',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}