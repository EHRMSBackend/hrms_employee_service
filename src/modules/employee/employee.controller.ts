import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { EmployeeQueryDto } from './dto/employee-query.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Controller()
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @MessagePattern('create_employee')
  async create(createEmployeeDto: CreateEmployeeDto) {
    return this.employeeService.create(createEmployeeDto);
  }

  @MessagePattern('find_all_employees')
  async findAll(query: EmployeeQueryDto) {
    return this.employeeService.findAll(query);
  }

  @MessagePattern('find_one_employee')
  async findOne(data: { id: string }) {
    return this.employeeService.findOne(data.id);
  }

  @MessagePattern('find_by_employee_id')
  async findByEmployeeId(data: { companyId: string; employeeId: string }) {
    return this.employeeService.findByEmployeeId(data.companyId, data.employeeId);
  }

  @MessagePattern('get_direct_reports')
  async getDirectReports(data: { managerId: string }) {
    return this.employeeService.getDirectReports(data.managerId);
  }

  @MessagePattern('update_employee')
  async update(data: { id: string; updateEmployeeDto: UpdateEmployeeDto }) {
    return this.employeeService.update(data.id, data.updateEmployeeDto);
  }

  @MessagePattern('remove_employee')
  async remove(data: { id: string }) {
    return this.employeeService.remove(data.id);
  }
}