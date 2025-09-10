import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsOptional, IsJSON, IsDateString } from 'class-validator';

export class CreateCompanySettingDto {
  @ApiProperty({ description: 'The ID of the company', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  companyId: string;

  @ApiProperty({ description: 'The key for the setting', example: 'timezone' })
  @IsString()
  settingKey: string;

  @ApiProperty({ description: 'The value for the setting in JSON format', required: false, example: '{"value": "UTC"}' })
  @IsOptional()
  @IsJSON()
  settingValue?: string;
}

export class UpdateCompanySettingDto {
  @ApiProperty({ description: 'The value for the setting in JSON format', required: false, example: '{"value": "America/New_York"}' })
  @IsOptional()
  @IsJSON()
  settingValue?: string;
}

export class CompanySettingResponseDto {
  @ApiProperty({ description: 'The ID of the company', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  companyId: string;

  @ApiProperty({ description: 'The key for the setting', example: 'timezone' })
  @IsString()
  settingKey: string;

  @ApiProperty({ description: 'The value for the setting in JSON format', required: false, example: '{"value": "UTC"}' })
  @IsOptional()
  settingValue?: any;

  @ApiProperty({ description: 'Creation date of the setting', example: '2025-09-07T19:11:00Z' })
  @IsDateString()
  createdAt: Date;

  @ApiProperty({ description: 'Last update date of the setting', example: '2025-09-07T19:11:00Z' })
  @IsDateString()
  updatedAt: Date;
}

export class PaginatedCompanySettingResponseDto {
  @ApiProperty({ description: 'List of company settings', type: [CompanySettingResponseDto] })
  data: CompanySettingResponseDto[];

  @ApiProperty({ description: 'Total number of settings', example: 100 })
  total: number;

  @ApiProperty({ description: 'Current page number', example: 1 })
  page: number;

  @ApiProperty({ description: 'Number of items per page', example: 10 })
  pageSize: number;
}