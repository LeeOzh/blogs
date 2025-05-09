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

  createPost(data:{title: string, content: string}) {
    return {
      code: 200,
      data,
      msg:'success'
    }
  }
}
