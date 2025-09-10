import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { LeaveRequestService } from './leave-service.service';
import { CreateLeaveRequestDto } from './dto/create-leave.dto';
import { LeaveRequestQueryDto } from './dto/leave-request.query.dto';
import { UpdateLeaveRequestDto } from './dto/update-leave.dto';

@Controller()
export class LeaveRequestController {
  constructor(private readonly service: LeaveRequestService) {}

  @MessagePattern('create_leave_request')
  async create(createDto: CreateLeaveRequestDto) {
    return this.service.create(createDto);
  }

  @MessagePattern('find_all_leave_requests')
  async findAll(paginateQuery: LeaveRequestQueryDto) {
    return this.service.findAll(paginateQuery);
  }

  @MessagePattern('find_leave_requests_by_company')
  async findByCompanyId(data: { companyId: string; paginateQuery: LeaveRequestQueryDto }) {
    return this.service.findByCompanyId(data.companyId, data.paginateQuery);
  }

  @MessagePattern('find_leave_requests_by_employee')
  async findByEmployeeId(data: { employeeId: string; paginateQuery: LeaveRequestQueryDto }) {
    return this.service.findByEmployeeId(data.employeeId, data.paginateQuery);
  }

  @MessagePattern('find_one_leave_request')
  async findOne(data: { id: string }) {
    return this.service.findOne(data.id);
  }

  @MessagePattern('update_leave_request')
  async update(data: { id: string; updateDto: UpdateLeaveRequestDto }) {
    return this.service.update(data.id, data.updateDto);
  }

  @MessagePattern('remove_leave_request')
  async remove(data: { id: string }) {
    return this.service.remove(data.id);
  }

  @MessagePattern('remove_leave_requests_by_company')
  async removeByCompanyId(data: { companyId: string }) {
    return this.service.removeByCompanyId(data.companyId);
  }

  @MessagePattern('remove_leave_requests_by_employee')
  async removeByEmployeeId(data: { employeeId: string }) {
    return this.service.removeByEmployeeId(data.employeeId);
  }
}