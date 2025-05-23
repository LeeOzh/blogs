import { Controller, Get, Param, Post, Body} from '@nestjs/common';
import { PostService } from './post.service'

@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}

  @Get()
  getAllPosts() {
    return this.postService.getAllPosts()
  }

  @Get(':id')
  getPostById(@Param('id') id: string) {
    return this.postService.getPostById(Number(id))
  }

  @Post('create')
  createPost(@Body() data: {title: string, content: string, imgUrl: string}) {
    return this.postService.createPost(data)
  }

  @Post('updateLike')
  updatePost(@Body() data: {id: number, like: boolean}) {
    return this.postService.updatePostLike(data)
  }
}
