import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto, PaginationDto } from './dto/create-department.dto';
import { DepartmentFilterDto } from './dto/department-filter.dto';

@Controller()
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @MessagePattern('create_department')
  async create(createDepartmentDto: CreateDepartmentDto) {
    return this.departmentService.create(createDepartmentDto);
  }

  @MessagePattern('find_all_departments')
  async findAll(filterDto: DepartmentFilterDto) {
    return this.departmentService.findAll(filterDto);
  }

  @MessagePattern('find_departments_by_company')
  async findByCompany(data: { companyId: string; filterDto: DepartmentFilterDto }) {
    return this.departmentService.findByCompanyId(data.companyId, data.filterDto);
  }

  @MessagePattern('get_department_hierarchy')
  async getDepartmentHierarchy(data: { companyId: string }) {
    return this.departmentService.getDepartmentHierarchy(data.companyId);
  }

  @MessagePattern('find_one_department')
  async findOne(data: { id: string }) {
    return this.departmentService.findOne(data.id);
  }

  @MessagePattern('get_sub_departments')
  async getSubDepartments(data: { id: string; paginationDto: PaginationDto }) {
    return this.departmentService.getSubDepartments(data.id, data.paginationDto);
  }

  @MessagePattern('get_department_stats')
  async getDepartmentStats(data: { id: string }) {
    return this.departmentService.getDepartmentStats(data.id);
  }
}