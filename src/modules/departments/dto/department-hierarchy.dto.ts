import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { DepartmentResponseDto } from './department-response.dto';

export class DepartmentHierarchyDto extends DepartmentResponseDto {
  @ApiPropertyOptional({
    description: 'Hierarchy level (0 = root)',
    example: 0,
  })
  level?: number;
}