
import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common'; // Adjust import path as needed
import { Prisma } from '@prisma/client';
import { DepartmentFilterDto } from './dto/department-filter.dto';
import { PaginatedDepartmentResponseDto } from './dto/paginated-department-response.dto';
import { DepartmentResponseDto } from './dto/department-response.dto';
import { DepartmentHierarchyDto } from './dto/department-hierarchy.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { CreateDepartmentDto, PaginationDto } from './dto/create-department.dto';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class DepartmentService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new department
   */
  async create(createDepartmentDto: CreateDepartmentDto): Promise<DepartmentResponseDto> {
    const { companyId, parentDepartmentId, managerId, ...departmentData } = createDepartmentDto;

    // Validate company exists
    await this.validateCompanyExists(companyId);

    // Validate parent department if provided
    if (parentDepartmentId) {
      await this.validateParentDepartment(parentDepartmentId, companyId);
    }

    // Validate manager if provided
    if (managerId) {
      await this.validateManager(managerId, companyId);
    }

    // Check for duplicate department name within company
    await this.checkDuplicateName(departmentData.name, companyId);

    try {
      const department = await this.prisma.department.create({
        data: {
          ...departmentData,
          companyId,
          parentDepartmentId,
          managerId,
        },
        include: this.getIncludeOptions(),
      });

      return this.mapToResponseDto(department);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Department with this name already exists in the company');
        }
      }
      throw error;
    }
  }

  /**
   * Get all departments with pagination and filtering
   */
  async findAll(filterDto: DepartmentFilterDto): Promise<PaginatedDepartmentResponseDto> {
    const {
      page = 1,
      limit = 10,
      companyId,
      parentDepartmentId,
      managerId,
      search,
      rootOnly,
      sortBy = 'name',
      sortOrder = 'asc',
    } = filterDto;

    const skip = (page - 1) * limit;
    const take = limit;

    // Build where clause
    const where: Prisma.DepartmentWhereInput = {
      ...(companyId && { companyId }),
      ...(parentDepartmentId && { parentDepartmentId }),
      ...(managerId && { managerId }),
      ...(rootOnly && { parentDepartmentId: null }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    // Build orderBy clause
    const orderBy: Prisma.DepartmentOrderByWithRelationInput = {};
    if (sortBy === 'name') orderBy.name = sortOrder;
    else if (sortBy === 'createdAt') orderBy.createdAt = sortOrder;
    else if (sortBy === 'updatedAt') orderBy.updatedAt = sortOrder;
    else if (sortBy === 'budget') orderBy.budget = sortOrder;
    else if (sortBy === 'headcountLimit') orderBy.headcountLimit = sortOrder;
    else orderBy.name = 'asc';

    const [departments, totalCount] = await Promise.all([
      this.prisma.department.findMany({
        where,
        skip,
        take,
        orderBy,
        include: this.getIncludeOptions(),
      }),
      this.prisma.department.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      data: departments.map(dept => this.mapToResponseDto(dept)),
      meta: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems: totalCount,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  /**
   * Get department by ID
   */
  async findOne(id: string): Promise<DepartmentResponseDto> {
    const department = await this.prisma.department.findUnique({
      where: { id },
      include: this.getIncludeOptions(),
    });

    if (!department) {
      throw new NotFoundException(`Department with ID ${id} not found`);
    }

    return this.mapToResponseDto(department);
  }

  /**
   * Get departments by company ID with pagination
   */
  async findByCompanyId(
    companyId: string,
    filterDto: DepartmentFilterDto,
  ): Promise<PaginatedDepartmentResponseDto> {
    return this.findAll({ ...filterDto, companyId });
  }

  /**
   * Get department hierarchy for a company
   */
  async getDepartmentHierarchy(companyId: string): Promise<DepartmentHierarchyDto[]> {
    const departments = await this.prisma.department.findMany({
      where: { companyId },
      include: {
        parentDepartment: true,
        subDepartments: {
          include: {
            subDepartments: {
              include: {
                subDepartments: true, // 3 levels deep
              },
            },
          },
        },
        manager: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        _count: {
          select: { employees: true },
        },
      },
    });

    // Build hierarchy starting from root departments
    const rootDepartments = departments.filter(dept => !dept.parentDepartmentId);
    
    return rootDepartments.map(dept => this.buildHierarchy(dept, departments, 0));
  }

  /**
   * Get sub-departments of a department
   */
  async getSubDepartments(
    departmentId: string,
    filterDto: PaginationDto,
  ): Promise<PaginatedDepartmentResponseDto> {
    return this.findAll({ ...filterDto, parentDepartmentId: departmentId });
  }

  /**
   * Update department
   */
  async update(id: string, updateDepartmentDto: UpdateDepartmentDto): Promise<DepartmentResponseDto> {
    // Check if department exists
    await this.findOne(id);

    const { companyId, parentDepartmentId, managerId, ...departmentData } = updateDepartmentDto;

    // Validate company if provided
    if (companyId) {
      await this.validateCompanyExists(companyId);
    }

    // Validate parent department if provided
    if (parentDepartmentId) {
      // Prevent circular reference
      if (parentDepartmentId === id) {
        throw new BadRequestException('Department cannot be its own parent');
      }
      
      const currentDept = await this.prisma.department.findUnique({
        where: { id },
        select: { companyId: true },
      });
      
      await this.validateParentDepartment(parentDepartmentId, currentDept!.companyId);
      await this.checkCircularReference(id, parentDepartmentId);
    }

    // Validate manager if provided
    if (managerId) {
      const currentDept = await this.prisma.department.findUnique({
        where: { id },
        select: { companyId: true },
      });
      
      await this.validateManager(managerId, currentDept!.companyId);
    }

    try {
      const updatedDepartment = await this.prisma.department.update({
        where: { id },
        data: {
          ...departmentData,
          ...(companyId && { companyId }),
          ...(parentDepartmentId !== undefined && { parentDepartmentId }),
          ...(managerId !== undefined && { managerId }),
        },
        include: this.getIncludeOptions(),
      });

      return this.mapToResponseDto(updatedDepartment);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Department with this name already exists in the company');
        }
      }
      throw error;
    }
  }

  /**
   * Delete department
   */
  async remove(id: string): Promise<void> {
    const department = await this.findOne(id);

    // Check if department has sub-departments
    const subDepartmentsCount = await this.prisma.department.count({
      where: { parentDepartmentId: id },
    });

    if (subDepartmentsCount > 0) {
      throw new BadRequestException('Cannot delete department with sub-departments');
    }

    // Check if department has employees
    const employeesCount = await this.prisma.employee.count({
      where: { departmentId: id },
    });

    if (employeesCount > 0) {
      throw new BadRequestException('Cannot delete department with employees');
    }

    await this.prisma.department.delete({
      where: { id },
    });
  }

  /**
   * Get department statistics
   */
  async getDepartmentStats(departmentId: string) {
    const department = await this.findOne(departmentId);

    const [
      employeesCount,
      subDepartmentsCount,
      activeEmployeesCount,
      avgSalary,
    ] = await Promise.all([
      this.prisma.employee.count({
        where: { departmentId },
      }),
      this.prisma.department.count({
        where: { parentDepartmentId: departmentId },
      }),
      this.prisma.employee.count({
        where: {
          departmentId,
          employmentStatus: 'active',
        },
      }),
      this.prisma.employee.aggregate({
        where: {
          departmentId,
          employmentStatus: 'active',
          baseSalary: { not: null },
        },
        _avg: {
          baseSalary: true,
        },
      }),
    ]);

    return {
      department,
      stats: {
        totalEmployees: employeesCount,
        activeEmployees: activeEmployeesCount,
        subDepartments: subDepartmentsCount,
        averageSalary: avgSalary._avg.baseSalary?.toNumber() || 0,
        budgetUtilization: department.budget 
          ? ((avgSalary._avg.baseSalary?.toNumber() || 0) * activeEmployeesCount * 12) / department.budget* 100
          : null,
      },
    };
  }

  // ============================================================================
  // PRIVATE HELPER METHODS
  // ============================================================================

  private getIncludeOptions() {
    return {
      parentDepartment: {
        select: {
          id: true,
          name: true,
        },
      },
      manager: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      _count: {
        select: {
          employees: true,
          subDepartments: true,
        },
      },
    };
  }

  private mapToResponseDto(department: any): DepartmentResponseDto {
    return {
      id: department.id,
      companyId: department.companyId,
      name: department.name,
      description: department.description,
      parentDepartmentId: department.parentDepartmentId,
      managerId: department.managerId,
      budget: department.budget?.toNumber(),
      headcountLimit: department.headcountLimit,
      createdAt: department.createdAt,
      updatedAt: department.updatedAt,
      parentDepartment: department.parentDepartment,
      manager: department.manager,
      employeeCount: department._count?.employees || 0,
    };
  }

  private buildHierarchy(
    department: any,
    allDepartments: any[],
    level: number,
  ): DepartmentHierarchyDto {
    const subDepartments = allDepartments
      .filter(dept => dept.parentDepartmentId === department.id)
      .map(subDept => this.buildHierarchy(subDept, allDepartments, level + 1));

    return {
      ...this.mapToResponseDto(department),
      subDepartments,
      level,
    };
  }

  private async validateCompanyExists(companyId: string): Promise<void> {
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      throw new NotFoundException(`Company with ID ${companyId} not found`);
    }
  }

  private async validateParentDepartment(parentDepartmentId: string, companyId: string): Promise<void> {
    const parentDepartment = await this.prisma.department.findUnique({
      where: { id: parentDepartmentId },
    });

    if (!parentDepartment) {
      throw new NotFoundException(`Parent department with ID ${parentDepartmentId} not found`);
    }

    if (parentDepartment.companyId !== companyId) {
      throw new BadRequestException('Parent department must belong to the same company');
    }
  }

  private async validateManager(managerId: string, companyId: string): Promise<void> {
    const manager = await this.prisma.employee.findUnique({
      where: { id: managerId },
    });

    if (!manager) {
      throw new NotFoundException(`Manager with ID ${managerId} not found`);
    }

    if (manager.companyId !== companyId) {
      throw new BadRequestException('Manager must belong to the same company');
    }

    if (manager.employmentStatus !== 'active') {
      throw new BadRequestException('Manager must be an active employee');
    }
  }

  private async checkDuplicateName(name: string, companyId: string, excludeId?: string): Promise<void> {
    const existing = await this.prisma.department.findFirst({
      where: {
        name,
        companyId,
        ...(excludeId && { id: { not: excludeId } }),
      },
    });

    if (existing) {
      throw new ConflictException('Department with this name already exists in the company');
    }
  }

  private async checkCircularReference(departmentId: string, parentDepartmentId: string): Promise<void> {
    let currentParentId = parentDepartmentId;
    
    while (currentParentId) {
      if (currentParentId === departmentId) {
        throw new BadRequestException('Circular reference detected in department hierarchy');
      }
      
      const parent = await this.prisma.department.findUnique({
        where: { id: currentParentId },
        select: { parentDepartmentId: true },
      });
      
      currentParentId = parent?.parentDepartmentId ?? "";
    }
  }
}

