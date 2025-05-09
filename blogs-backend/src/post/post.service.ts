import { Injectable } from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service'

@Injectable()
export class PostService {
  constructor (private prisma:  PrismaService) {}

  async getAllPosts() {
    const posts = await this.prisma.post.findMany({
      orderBy: { createdAt: 'desc' }, // 按时间倒序
    });
   
    return {
      code: 200,
      data: posts,
      msg: 'success'
    }
  }

  getPostById(id: number) {
    return this.prisma.post.findUnique({
      where: {id}
    })
  }

  async createPost(data:{title: string, content: string}) {
    // 需要使用 await 等待数据库操作完成
    const post = await this.prisma.post.create({data})
    return {
      code: 200,
      data: post,
      msg: 'success'
    }
  }
}
