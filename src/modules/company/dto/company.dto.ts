import { ApiProperty } from '@nestjs/swagger';
import { BillingCycle, SubscriptionStatus } from '@prisma/client';
import { IsString, IsOptional, IsInt, IsUUID, IsEnum, IsDateString } from 'class-validator';


export class CreateCompanyDto {
  @ApiProperty({ description: 'The name of the company', example: 'Acme Corp' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'The unique domain of the company', example: 'acme.com' })
  @IsString()
  domain: string;

  @ApiProperty({ description: 'The industry of the company', required: false, example: 'Technology' })
  @IsOptional()
  @IsString()
  industry?: string;

  @ApiProperty({ description: 'The size of the company', required: false, example: 'Small' })
  @IsOptional()
  @IsString()
  companySize?: string;

  @ApiProperty({ description: 'The subscription plan', example: 'Premium' })
  @IsString()
  subscriptionPlan: string;

  @ApiProperty({ description: 'The subscription status', enum: SubscriptionStatus, example: 'active' })
  @IsEnum(SubscriptionStatus)
  subscriptionStatus: SubscriptionStatus;

  @ApiProperty({ description: 'The billing cycle', enum: BillingCycle, example: 'monthly' })
  @IsEnum(BillingCycle)
  billingCycle: BillingCycle;

  @ApiProperty({ description: 'Maximum number of employees', example: 100 })
  @IsInt()
  maxEmployees: number;

  @ApiProperty({ description: 'Maximum storage in GB', example: 100 })
  @IsInt()
  maxStorageGb: number;
}

export class UpdateCompanyDto {
  @ApiProperty({ description: 'The name of the company', required: false, example: 'Acme Corp Updated' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'The industry of the company', required: false, example: 'Technology' })
  @IsOptional()
  @IsString()
  industry?: string;

  @ApiProperty({ description: 'The size of the company', required: false, example: 'Medium' })
  @IsOptional()
  @IsString()
  companySize?: string;

  @ApiProperty({ description: 'The subscription plan', required: false, example: 'Enterprise' })
  @IsOptional()
  @IsString()
  subscriptionPlan?: string;

  @ApiProperty({ description: 'The subscription status', enum: SubscriptionStatus, required: false, example: 'active' })
  @IsOptional()
  @IsEnum(SubscriptionStatus)
  subscriptionStatus?: SubscriptionStatus;

  @ApiProperty({ description: 'The billing cycle', enum: BillingCycle, required: false, example: 'yearly' })
  @IsOptional()
  @IsEnum(BillingCycle)
  billingCycle?: BillingCycle;

  @ApiProperty({ description: 'Maximum number of employees', required: false, example: 200 })
  @IsOptional()
  @IsInt()
  maxEmployees?: number;

  @ApiProperty({ description: 'Maximum storage in GB', required: false, example: 200 })
  @IsOptional()
  @IsInt()
  maxStorageGb?: number;
}

export class CompanyResponseDto {
  @ApiProperty({ description: 'The unique identifier of the company', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  id: string;

  @ApiProperty({ description: 'The name of the company', example: 'Acme Corp' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'The domain of the company', example: 'acme.com' })
  @IsString()
  domain: string;

  @ApiProperty({ description: 'The industry of the company', required: false, example: 'Technology' })
  // @IsOptional()
  @IsString()
  industry: string;

  @ApiProperty({ description: 'The size of the company', required: false, example: 'Small' })
  @IsOptional()
  @IsString()
  companySize?: string;

  @ApiProperty({ description: 'The subscription plan', example: 'Premium' })
  @IsString()
  subscriptionPlan: string;

  @ApiProperty({ description: 'The subscription status', enum: SubscriptionStatus, example: 'active' })
  @IsEnum(SubscriptionStatus)
  subscriptionStatus: SubscriptionStatus;

  @ApiProperty({ description: 'The billing cycle', enum: BillingCycle, example: 'monthly' })
  @IsEnum(BillingCycle)
  billingCycle: BillingCycle;

  @ApiProperty({ description: 'Maximum number of employees', example: 100 })
  @IsInt()
  maxEmployees: number;

  @ApiProperty({ description: 'Maximum storage in GB', example: 100 })
  @IsInt()
  maxStorageGb: number;

  @ApiProperty({ description: 'Creation date of the company', example: '2025-09-07T19:11:00Z' })
  @IsDateString()
  createdAt: Date;

  @ApiProperty({ description: 'Last update date of the company', example: '2025-09-07T19:11:00Z' })
  @IsDateString()
  updatedAt: Date;

  @ApiProperty({ description: 'Deletion date of the company', required: false, example: null })
  @IsOptional()
  @IsDateString()
  deletedAt?: Date;
}

export class PaginatedCompanyResponseDto {
  @ApiProperty({ description: 'List of companies', type: [CompanyResponseDto] })
  data: CompanyResponseDto[];

  @ApiProperty({ description: 'Total number of companies', example: 100 })
  total: number;

  @ApiProperty({ description: 'Current page number', example: 1 })
  page: number;

  @ApiProperty({ description: 'Number of items per page', example: 10 })
  pageSize: number;
}