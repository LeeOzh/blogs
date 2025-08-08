import { Module } from '@nestjs/common';
import { WebsiteController } from './website.controller';
import { WebsiteService } from './website.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [WebsiteController],
  providers: [WebsiteService],
  exports: [WebsiteService],
})
export class WebsiteModule {}