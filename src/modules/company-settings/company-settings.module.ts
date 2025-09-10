import { Module } from '@nestjs/common';
import { CompanySettingController } from './company-settings.controller';
import { CompanySettingService } from './company-settings.service';
import { PrismaService } from 'src/db/prisma.service';
import { PrismaModule } from 'src/db/prisma.module';


@Module({
  imports: [PrismaModule],
  controllers: [CompanySettingController],
  providers: [CompanySettingService],
})
export class CompanySettingModule {}