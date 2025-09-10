import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { LeaveRequest } from '@prisma/client';
import { PaginateQuery, paginate, Paginated } from 'nestjs-paginate';
import { UpdateLeaveRequestDto } from './dto/update-leave.dto';
import { CreateLeaveRequestDto } from './dto/create-leave.dto';
import { LeaveRequestQueryDto } from './dto/leave-request.query.dto';
import { PaginatedResult } from 'src/common/interfaces/paginated-result.interface';
import { promiseHooks } from 'v8';

@Injectable()
export class LeaveRequestService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateLeaveRequestDto): Promise<LeaveRequest> {
    return this.prisma.leaveRequest.create({
      data: {
        ...createDto,
        startDate: new Date(createDto.startDate),
        endDate: new Date(createDto.endDate),
        requestedAt: new Date(createDto.requestedAt),
      },
    });
  }

  async findAll(
    query: LeaveRequestQueryDto,
  ): Promise<PaginatedResult<LeaveRequest>> {
    const {
      page = 1,
      limit = 10,
      search,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      ...filters
    } = query;
    const skip = (page - 1) * limit;

    const where: any = {
      deletedAt: null,
      ...filters,
    };

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { employeeId: { contains: search, mode: 'insensitive' } },
      ];
    }
    const [leaveRequests, total] = await Promise.all([
      this.prisma.leaveRequest.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder.toLowerCase() },
        include: {
          employee: true,
          // approver: true,
        },
      }),
      this.prisma.leaveRequest.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);
    return {
      data: leaveRequests,
      meta: {
        total,
        page,
        totalPages,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  async findByCompanyId(
    companyId: string,
    query: LeaveRequestQueryDto,
  ): Promise<PaginatedResult<LeaveRequest>> {
       const {
      page = 1,
      limit = 10,
      search,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      ...filters
    } = query;
    const skip = (page - 1) * limit;

    const where: any = {
      companyId,
      deletedAt: null,
      ...filters,
    };

     const [leaves, total] = await Promise.all([
        this.prisma.leaveRequest.findMany({
          where,
          skip,
          take: limit,
          include: {
            employee: true
          }

        }),
        this.prisma.leaveRequest.count({where})
     ])
      const totalPages = Math.ceil(total / limit);

    return {
      data: leaves,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  
  }

  async findByEmployeeId(employeeId: string, query: any): Promise<any> {
    const {
      page = 1,
      limit = 10,
      search,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      ...filters
    } = query;
    const skip = (page - 1) * limit;

    const where: any = {
      employeeId,
      ...filters,
    };

    if (search) {
      where.OR = [
        { leaveType: { contains: search, mode: 'insensitive' } },
        { status: { contains: search, mode: 'insensitive' } },
        { reason: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [leaveRequests, total] = await Promise.all([
      this.prisma.leaveRequest.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder.toLowerCase() },
      }),
      this.prisma.leaveRequest.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: leaveRequests,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  async findOne(id: string): Promise<LeaveRequest> {
    const request = await this.prisma.leaveRequest.findUnique({
      where: { id },
    });
    if (!request) throw new NotFoundException('Leave request not found');
    return request;
  }

  async update(
    id: string,
    updateDto: UpdateLeaveRequestDto,
  ): Promise<LeaveRequest> {
    return this.prisma.leaveRequest.update({
      where: { id },
      data: {
        ...updateDto,
        startDate: updateDto.startDate
          ? new Date(updateDto.startDate)
          : undefined,
        endDate: updateDto.endDate ? new Date(updateDto.endDate) : undefined,
        approvedAt: updateDto.approvedAt
          ? new Date(updateDto.approvedAt)
          : undefined,
      },
    });
  }

  async remove(id: string): Promise<LeaveRequest> {
    return this.prisma.leaveRequest.delete({ where: { id } });
  }

  async removeByCompanyId(companyId: string): Promise<{ count: number }> {
    return this.prisma.leaveRequest.deleteMany({ where: { companyId } });
  }

  async removeByEmployeeId(employeeId: string): Promise<{ count: number }> {
    return this.prisma.leaveRequest.deleteMany({ where: { employeeId } });
  }
}
