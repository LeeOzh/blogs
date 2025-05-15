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

  async getPostById(id: number) {
    const data = await this.prisma.post.findUnique({
      where: {id}
    })
    return {
      code: 200,
      data,
      msg:'success'
    }
  }

  async createPost(data:{title: string, content: string, imgUrl: string}) {
    // 需要使用 await 等待数据库操作完成
    const post = await this.prisma.post.create({data})
    return {
      code: 200,
      data: post,
      msg: 'success'
    }
  }

  async updatePostLike(data: {id: number,like: boolean}) {
    const thisId = await this.prisma.post.findUnique({
      where: {id:data.id}
    })
    thisId && await this.prisma.post.update({
      where: {id:data.id},
      data: {
       like: data.like ? thisId.like + 1 : thisId.like - 1
      }
    })
    return {
      code: 200,
      data: 'success',
      msg:'success'
    }
  }
}
