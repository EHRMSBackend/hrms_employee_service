import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CompanyService } from './company.service';
import { CreateCompanyDto, UpdateCompanyDto } from './dto/company.dto';

@Controller()
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @MessagePattern('create_company')
  async create(createCompanyDto: CreateCompanyDto) {
    return this.companyService.create(createCompanyDto);
  }

  @MessagePattern('find_all_companies')
  async findAll(data: { page: number; pageSize: number }) {
    return this.companyService.findAll(data.page, data.pageSize);
  }

  @MessagePattern('find_one_company')
  async findOne(data: { id: string }) {
    return this.companyService.findOne(data.id);
  }

  @MessagePattern('update_company')
  async update(data: { id: string; updateCompanyDto: UpdateCompanyDto }) {
    return this.companyService.update(data.id, data.updateCompanyDto);
  }

  @MessagePattern('remove_company')
  async remove(data: { id: string }) {
    return this.companyService.remove(data.id);
  }
}