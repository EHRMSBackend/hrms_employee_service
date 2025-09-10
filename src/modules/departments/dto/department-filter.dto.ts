
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsUUID, IsString, IsOptional, IsDecimal, IsInt, Min, Max, Length } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { Decimal } from '@prisma/client/runtime/library';
import { PaginationDto } from './create-department.dto';

// Department filter DTO
export class DepartmentFilterDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Filter by company ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID(4)
  companyId?: string;

  @ApiPropertyOptional({
    description: 'Filter by parent department ID',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsOptional()
  @IsUUID(4)
  parentDepartmentId?: string;

  @ApiPropertyOptional({
    description: 'Filter by manager ID',
    example: '123e4567-e89b-12d3-a456-426614174002',
  })
  @IsOptional()
  @IsUUID(4)
  managerId?: string;

  @ApiPropertyOptional({
    description: 'Include departments with no parent (root departments)',
    example: true,
  })
  @IsOptional()
  @Type(() => Boolean)
  rootOnly?: boolean;

  @ApiPropertyOptional({
    description: 'Sort field',
    example: 'name',
    enum: ['name', 'createdAt', 'updatedAt', 'budget', 'headcountLimit'],
  })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiPropertyOptional({
    description: 'Sort order',
    example: 'asc',
    enum: ['asc', 'desc'],
  })
  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc';
}
