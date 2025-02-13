import { Injectable } from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service'

@Injectable()
export class PostService {
  constructor (private prisma:  PrismaService) {}

  getAllPosts() {
    return this.prisma.post.findMany()
  }

  getPostById(id: number) {
    return this.prisma.post.findUnique({
      where: {id}
    })
  }

  createPost(data:{title: string, content: string}) {
    return this.prisma.post.create({data})
  }
}
