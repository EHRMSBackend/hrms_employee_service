import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { CreateCompanySettingDto, UpdateCompanySettingDto, CompanySettingResponseDto, PaginatedCompanySettingResponseDto } from './dto/company-settings.dto';

@Injectable()
export class CompanySettingService {
  constructor(private prisma: PrismaService) {}

  async create(createCompanySettingDto: CreateCompanySettingDto): Promise<CompanySettingResponseDto> {
    const { companyId, settingKey, settingValue } = createCompanySettingDto;

    // Check if company exists
    const company = await this.prisma.company.findUnique({
      where: { id: companyId, deletedAt: null },
    });

    if (!company) {
      throw new NotFoundException(`Company with ID ${companyId} not found`);
    }

    return this.prisma.companySetting.create({
      data: {
        companyId,
        settingKey,
        settingValue: settingValue ? JSON.parse(settingValue) : null,
      },
    });
  }

  async findAll(companyId: string, page: number = 1, pageSize: number = 10): Promise<PaginatedCompanySettingResponseDto> {
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const [settings, total] = await Promise.all([
      this.prisma.companySetting.findMany({
        where: { companyId },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.companySetting.count({ where: { companyId } }),
    ]);

    return {
      data: settings,
      total,
      page,
      pageSize,
    };
  }

  async findOne(companyId: string, settingKey: string): Promise<CompanySettingResponseDto> {
    const setting = await this.prisma.companySetting.findUnique({
      where: { companyId_settingKey: { companyId, settingKey } },
    });

    if (!setting) {
      throw new NotFoundException(`Setting ${settingKey} for company ${companyId} not found`);
    }

    return setting;
  }

  async update(companyId: string, settingKey: string, updateCompanySettingDto: UpdateCompanySettingDto): Promise<CompanySettingResponseDto> {
    const setting = await this.prisma.companySetting.findUnique({
      where: { companyId_settingKey: { companyId, settingKey } },
    });

    if (!setting) {
      throw new NotFoundException(`Setting ${settingKey} for company ${companyId} not found`);
    }

    return this.prisma.companySetting.update({
      where: { companyId_settingKey: { companyId, settingKey } },
      data: {
        settingValue: updateCompanySettingDto.settingValue ? JSON.parse(updateCompanySettingDto.settingValue) : null,
        updatedAt: new Date(),
      },
    });
  }

  async remove(companyId: string, settingKey: string): Promise<void> {
    const setting = await this.prisma.companySetting.findUnique({
      where: { companyId_settingKey: { companyId, settingKey } },
    });

    if (!setting) {
      throw new NotFoundException(`Setting ${settingKey} for company ${companyId} not found`);
    }

    await this.prisma.companySetting.delete({
      where: { companyId_settingKey: { companyId, settingKey } },
    });
  }
}