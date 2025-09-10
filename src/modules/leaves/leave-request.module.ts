import {Module} from '@nestjs/common';
import { LeaveRequestService } from './leave-service.service';
import { LeaveRequestController } from './leave-controller.controller';
import { PrismaModule } from 'src/db/prisma.module';
@Module({
imports: [PrismaModule],
controllers: [LeaveRequestController],
providers: [LeaveRequestService],
exports: [LeaveRequestService],
})
export class LeaveRequestModule {}