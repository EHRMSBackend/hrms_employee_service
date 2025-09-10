import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsUUID, IsString, IsOptional, IsDecimal, IsInt, Min, Max, Length } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { Decimal } from '@prisma/client/runtime/library';
import { DepartmentResponseDto } from './department-response.dto';

export class DepartmentHierarchyDto extends DepartmentResponseDto {
  @ApiPropertyOptional({
    description: 'Complete sub-department hierarchy',
    type: [DepartmentHierarchyDto],
  })
  subDepartments?: DepartmentHierarchyDto[];

  @ApiPropertyOptional({
    description: 'Hierarchy level (0 = root)',
    example: 0,
  })
  level?: number;
}