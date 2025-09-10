import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsUUID, IsString, IsOptional, IsDecimal, IsInt, Min, Max, Length } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { Decimal } from '@prisma/client/runtime/library';
import { DepartmentResponseDto } from './department-response.dto';

export class PaginatedDepartmentResponseDto {
  @ApiProperty({
    description: 'Array of departments',
    type: [DepartmentResponseDto],
  })
  data: DepartmentResponseDto[];

  @ApiProperty({
    description: 'Pagination metadata',
  })
  meta: {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}
