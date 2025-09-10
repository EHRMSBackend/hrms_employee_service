import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsUUID, IsString, IsOptional, IsDecimal, IsInt, Min, Max, Length } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { Decimal } from '@prisma/client/runtime/library';

// Response DTOs
export class DepartmentResponseDto {
  @ApiProperty({
    description: 'Department ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Company ID',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  companyId: string;

  @ApiProperty({
    description: 'Department name',
    example: 'Engineering',
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Department description',
    example: 'Software development and engineering team',
  })
  description?: string;

  @ApiPropertyOptional({
    description: 'Parent department ID',
    example: '123e4567-e89b-12d3-a456-426614174002',
  })
  parentDepartmentId?: string;

  @ApiPropertyOptional({
    description: 'Department manager ID',
    example: '123e4567-e89b-12d3-a456-426614174003',
  })
  managerId?: string;

  @ApiPropertyOptional({
    description: 'Department budget',
    example: 100000.00,
  })
  budget?: number;

  @ApiPropertyOptional({
    description: 'Maximum headcount limit',
    example: 50,
  })
  headcountLimit?: number;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: Date;

  // Relations
  @ApiPropertyOptional({
    description: 'Parent department information',
  })
  parentDepartment?: Partial<DepartmentResponseDto>;

  @ApiPropertyOptional({
    description: 'Sub-departments',
    type: [DepartmentResponseDto],
  })
  subDepartments?: DepartmentResponseDto[];

  @ApiPropertyOptional({
    description: 'Department manager information',
  })
  manager?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };

  @ApiPropertyOptional({
    description: 'Current employee count',
    example: 25,
  })
  employeeCount?: number;
}


