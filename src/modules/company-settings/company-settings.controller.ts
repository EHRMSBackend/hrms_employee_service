import { Controller, Inject } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CompanySettingService } from './company-settings.service';
import { CreateCompanySettingDto, UpdateCompanySettingDto } from './dto/company-settings.dto';

@Controller()
export class CompanySettingController {
  constructor( private readonly companySettingService: CompanySettingService) {}

  @MessagePattern('create_company_setting')
  async create(data: CreateCompanySettingDto & { companyId: string }) {
    return this.companySettingService.create(data);
  }

  @MessagePattern('find_all_company_settings')
  async findAll(data: { companyId: string; page: number; pageSize: number }) {
    return this.companySettingService.findAll(data.companyId, data.page, data.pageSize);
  }

  @MessagePattern('find_one_company_setting')
  async findOne(data: { companyId: string; settingKey: string }) {
    return this.companySettingService.findOne(data.companyId, data.settingKey);
  }

  @MessagePattern('update_company_setting')
  async update(data: { companyId: string; settingKey: string; updateCompanySettingDto: UpdateCompanySettingDto }) {
    return this.companySettingService.update(data.companyId, data.settingKey, data.updateCompanySettingDto);
  }

  @MessagePattern('remove_company_setting')
  async remove(data: { companyId: string; settingKey: string }) {
    return this.companySettingService.remove(data.companyId, data.settingKey);
  }
}