import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateEmployeeDto } from './create-employee.dto';
import { IsOptional, IsDateString } from 'class-validator';

export class UpdateEmployeeDto extends PartialType(CreateEmployeeDto) {
  @ApiPropertyOptional({
    description: 'Termination date',
    example: '2024-12-31',
  })
  @IsOptional()
  @IsDateString()
  terminationDate?: string;
}