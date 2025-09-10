
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsUUID, IsString, IsOptional, IsDecimal, IsInt, Min, Max, Length } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { Decimal } from '@prisma/client/runtime/library';
import { CreateDepartmentDto } from './create-department.dto';


// Update Department DTO
export class UpdateDepartmentDto extends PartialType(CreateDepartmentDto) {
  @ApiPropertyOptional({
    description: 'Company ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID(4)
  companyId?: string;
}