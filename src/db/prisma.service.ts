import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { createSoftDeleteExtension } from 'prisma-extension-soft-delete';

const softDeleteModels = {};

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      log: ['info', 'query', 'warn'],
      errorFormat: 'pretty',
    });

    const softDeleteExtension = createSoftDeleteExtension({
      models: softDeleteModels,
      defaultConfig: {
        field: 'deletedAt',
        createValue: (deleted) => (deleted ? new Date() : null),
        allowCompoundUniqueIndexWhere: true,
      },
    });

    return this.$extends(softDeleteExtension) as this;
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
