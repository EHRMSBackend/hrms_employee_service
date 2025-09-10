import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PaginatedResult } from 'src/common/interfaces/paginated-result.interface';
import { PrismaService } from 'src/db/prisma.service';
import { CreateEmployeeDto } from 'src/modules/employee/dto/create-employee.dto';
import { EmployeeQueryDto } from 'src/modules/employee/dto/employee-query.dto';
import { EmployeeResponseDto } from 'src/modules/employee/dto/employee-response.dto';
import { UpdateEmployeeDto } from 'src/modules/employee/dto/update-employee.dto';

@Injectable()
export class EmployeeService {
  constructor(private prisma: PrismaService) {}

  async create(
    createEmployeeDto: CreateEmployeeDto,
  ): Promise<EmployeeResponseDto> {
    // Check if employee ID already exists in the company
    const existingEmployee = await this.prisma.employee.findFirst({
      where: {
        companyId: createEmployeeDto.companyId,
        employeeId: createEmployeeDto.employeeId,
      },
    });

    if (existingEmployee) {
      throw new ConflictException('Employee ID already exists in this company');
    }

    // Check if email already exists in the company
    const existingEmail = await this.prisma.employee.findFirst({
      where: {
        companyId: createEmployeeDto.companyId,
        email: createEmployeeDto.email,
      },
    });

    if (existingEmail) {
      throw new ConflictException('Email already exists in this company');
    }

    const employee = await this.prisma.employee.create({
      data: {
        ...createEmployeeDto,
        dateOfBirth: createEmployeeDto.dateOfBirth
          ? new Date(createEmployeeDto.dateOfBirth)
          : null,
        hireDate: new Date(createEmployeeDto.hireDate),
        probationEndDate: createEmployeeDto.probationEndDate
          ? new Date(createEmployeeDto.probationEndDate)
          : null,
      },
      include: {
        company: true,
        department: true,
        position: true,
        manager: true,
      },
    });

    return employee;
  }

  async findAll(
    query: EmployeeQueryDto,
  ): Promise<PaginatedResult<EmployeeResponseDto>> {
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

    const [employees, total] = await Promise.all([
      this.prisma.employee.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder.toLowerCase() },
        include: {
          department: true,
          position: true,
          manager: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      }),
      this.prisma.employee.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: employees,
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

  async findOne(id: string): Promise<EmployeeResponseDto> {
    const employee = await this.prisma.employee.findFirst({
      where: { id, deletedAt: null },
      include: {
        company: true,
        department: true,
        position: true,
        manager: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        directReports: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            position: true,
          },
        },
      },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    return employee;
  }

  async findByEmployeeId(
    companyId: string,
    employeeId: string,
  ): Promise<EmployeeResponseDto> {
    const employee = await this.prisma.employee.findFirst({
      where: {
        companyId,
        employeeId,
        deletedAt: null,
      },
      include: {
        company: true,
        department: true,
        position: true,
        manager: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    return employee;
  }

  async update(
    id: string,
    updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<EmployeeResponseDto> {
    const existingEmployee = await this.prisma.employee.findFirst({
      where: { id, deletedAt: null },
    });

    if (!existingEmployee) {
      throw new NotFoundException('Employee not found');
    }

    // Check for conflicts if updating email or employeeId
    if (
      updateEmployeeDto.email &&
      updateEmployeeDto.email !== existingEmployee.email
    ) {
      const existingEmail = await this.prisma.employee.findFirst({
        where: {
          companyId: existingEmployee.companyId,
          email: updateEmployeeDto.email,
          id: { not: id },
        },
      });

      if (existingEmail) {
        throw new ConflictException('Email already exists in this company');
      }
    }

    if (
      updateEmployeeDto.employeeId &&
      updateEmployeeDto.employeeId !== existingEmployee.employeeId
    ) {
      const existingEmployeeId = await this.prisma.employee.findFirst({
        where: {
          companyId: existingEmployee.companyId,
          employeeId: updateEmployeeDto.employeeId,
          id: { not: id },
        },
      });

      if (existingEmployeeId) {
        throw new ConflictException(
          'Employee ID already exists in this company',
        );
      }
    }

    const employee = await this.prisma.employee.update({
      where: { id },
      data: {
        ...updateEmployeeDto,
        dateOfBirth: updateEmployeeDto.dateOfBirth
          ? new Date(updateEmployeeDto.dateOfBirth)
          : undefined,
        hireDate: updateEmployeeDto.hireDate
          ? new Date(updateEmployeeDto.hireDate)
          : undefined,
        probationEndDate: updateEmployeeDto.probationEndDate
          ? new Date(updateEmployeeDto.probationEndDate)
          : undefined,
        terminationDate: updateEmployeeDto.terminationDate
          ? new Date(updateEmployeeDto.terminationDate)
          : undefined,
      },
      include: {
        company: true,
        department: true,
        position: true,
        manager: true,
      },
    });

    return employee;
  }

  async remove(id: string): Promise<void> {
    const employee = await this.prisma.employee.findFirst({
      where: { id, deletedAt: null },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    // Soft delete
    await this.prisma.employee.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        employmentStatus: 'terminated',
      },
    });
  }

  async getDirectReports(managerId: string): Promise<EmployeeResponseDto[]> {
    const directReports = await this.prisma.employee.findMany({
      where: {
        managerId,
        deletedAt: null,
      },
      include: {
        position: true,
        department: true,
      },
    });

    return directReports;
  }
}
