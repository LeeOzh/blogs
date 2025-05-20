import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { PostModule } from './post/post.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [PrismaModule, PostModule, ThrottlerModule.forRoot({
    throttlers:[{
      ttl: 60,
      limit: 10
    }]
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
