import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TerminusModule } from '@nestjs/terminus';
import { PrismaModule } from './db/prisma.module';
import { LeaveRequestModule } from './modules/leaves/leave-request.module';
import { EmployeeModule } from './modules/employee/employee.module';
import { CompanyModule } from './modules/company/company.module';
import { CompanySettingModule } from './modules/company-settings/company-settings.module';

@Module({
  imports: [
    
    ClientsModule.register([
      {
        name: "AUTH_CLIENT",
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
          queue: 'auth_queue',
          queueOptions: { durable: false },
        }
      }
    ]),
    TerminusModule,
    PrismaModule,
    LeaveRequestModule,
    EmployeeModule,
    CompanyModule,
    CompanySettingModule,

  ],
// payroll services, employee services ..etc.
})
export class AppModule {}
