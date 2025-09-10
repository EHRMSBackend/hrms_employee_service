
// ============================================================================
// DTOs (Data Transfer Objects)
// ============================================================================

import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsUUID, IsString, IsOptional, IsDecimal, IsInt, Min, Max, Length } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { Decimal } from '@prisma/client/runtime/library';

// Base pagination DTO
export class PaginationDto {
  @ApiPropertyOptional({
    description: 'Page number (1-based)',
    example: 1,
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    example: 10,
    minimum: 1,
    maximum: 100,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Search term for department name',
    example: 'Engineering',
  })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  search?: string;
}

// Create Department DTO
export class CreateDepartmentDto {
  @ApiProperty({
    description: 'Company ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID(4)
  companyId: string;

  @ApiProperty({
    description: 'Department name',
    example: 'Engineering',
    maxLength: 100,
  })
  @IsString()
  @Length(1, 100)
  name: string;

  @ApiPropertyOptional({
    description: 'Department description',
    example: 'Software development and engineering team',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Parent department ID for hierarchical structure',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsOptional()
  @IsUUID(4)
  parentDepartmentId?: string;

  @ApiPropertyOptional({
    description: 'Department manager ID',
    example: '123e4567-e89b-12d3-a456-426614174002',
  })
  @IsOptional()
  @IsUUID(4)
  managerId?: string;

  @ApiPropertyOptional({
    description: 'Department budget',
    example: 100000.00,
  })
  @IsOptional()
  @Type(() => Number)
  @Transform(({ value }) => new Decimal(value))
  budget?: Decimal;

  @ApiPropertyOptional({
    description: 'Maximum number of employees allowed',
    example: 50,
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  headcountLimit?: number;
}

