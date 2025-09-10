import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import {
  CreateCompanyDto,
  UpdateCompanyDto,
  CompanyResponseDto,
  PaginatedCompanyResponseDto,
} from './dto/company.dto';

@Injectable()
export class CompanyService {
  constructor(private prisma: PrismaService) {}

  async create(
    createCompanyDto: CreateCompanyDto,
  ): Promise<CompanyResponseDto> {
    try {
     const savedCompany = await  this.prisma.company.create({
        data: {
         ...createCompanyDto
        },
      });
      const {industry,companySize,deletedAt,...rest}=savedCompany
      return { ...rest, industry: industry || '', companySize: companySize || '', deletedAt: deletedAt ||  undefined}; 
    } catch (error) {
      throw new Error(`Failed to create company: ${error.message}`);
    }
  }

  async findAll(
    page: number = 1,
    pageSize: number = 10,
  ){
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const [companies, total] = await Promise.all([
      this.prisma.company.findMany({
        where: { deletedAt: null },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.company.count({ where: { deletedAt: null } }),
    ]);

    return {
      data: companies,
      total,
      page,
      pageSize,
    };
  }

  async findOne(id: string) {
    const company = await this.prisma.company.findUnique({
      where: { id, deletedAt: null },
    });

    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }

    return company;
  }

  async update(
    id: string,
    updateCompanyDto: UpdateCompanyDto,
  ){
    const company = await this.prisma.company.findUnique({
      where: { id, deletedAt: null },
    });

    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }

    return this.prisma.company.update({
      where: { id },
      data: {
        ...updateCompanyDto,
        updatedAt: new Date(),
      },
    });
  }

  async remove(id: string): Promise<void> {
    const company = await this.prisma.company.findUnique({
      where: { id, deletedAt: null },
    });

    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }

    await this.prisma.company.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
