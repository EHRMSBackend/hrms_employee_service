import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsOptional,
  IsDateString,
  IsEnum,
  IsUUID,
  IsDecimal,
  IsNotEmpty,
  MaxLength,
  MinLength,
} from 'class-validator';

export enum EmploymentStatus {
  ACTIVE = 'active',
  TERMINATED = 'terminated',
  SUSPENDED = 'suspended',
  ON_LEAVE = 'on_leave',
}

export enum EmploymentType {
  FULL_TIME = 'full_time',
  PART_TIME = 'part_time',
  CONTRACT = 'contract',
  INTERN = 'intern',
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export enum MaritalStatus {
  SINGLE = 'single',
  MARRIED = 'married',
  DIVORCED = 'divorced',
  WIDOWED = 'widowed',
}

export class CreateEmployeeDto {
  @ApiProperty({
    description: 'Company ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsNotEmpty()
  @IsUUID()
  companyId: string;

  @ApiPropertyOptional({
    description: 'User ID (if employee has system access)',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiProperty({
    description: 'Company internal employee ID',
    example: 'EMP001',
    maxLength: 50,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  employeeId: string;

  @ApiProperty({
    description: 'First name',
    example: 'John',
    maxLength: 100,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  firstName: string;

  @ApiProperty({
    description: 'Last name',
    example: 'Doe',
    maxLength: 100,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  lastName: string;

  @ApiProperty({
    description: 'Email address',
    example: 'john.doe@company.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiPropertyOptional({
    description: 'Phone number',
    example: '+1234567890',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    description: 'Date of birth',
    example: '1990-01-15',
  })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiPropertyOptional({
    description: 'Gender',
    enum: Gender,
    example: Gender.MALE,
  })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiPropertyOptional({
    description: 'Marital status',
    enum: MaritalStatus,
    example: MaritalStatus.SINGLE,
  })
  @IsOptional()
  @IsEnum(MaritalStatus)
  maritalStatus?: MaritalStatus;

  @ApiPropertyOptional({
    description: 'Nationality',
    example: 'American',
  })
  @IsOptional()
  @IsString()
  nationality?: string;

  @ApiProperty({
    description: 'Hire date',
    example: '2024-01-15',
  })
  @IsNotEmpty()
  @IsDateString()
  hireDate: string;

  @ApiPropertyOptional({
    description: 'Employment status',
    enum: EmploymentStatus,
    default: EmploymentStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(EmploymentStatus)
  employmentStatus?: EmploymentStatus;

  @ApiProperty({
    description: 'Employment type',
    enum: EmploymentType,
    example: EmploymentType.FULL_TIME,
  })
  @IsNotEmpty()
  @IsEnum(EmploymentType)
  employmentType: EmploymentType;

  @ApiPropertyOptional({
    description: 'Probation end date',
    example: '2024-04-15',
  })
  @IsOptional()
  @IsDateString()
  probationEndDate?: string;

  @ApiPropertyOptional({
    description: 'Department ID',
    example: '550e8400-e29b-41d4-a716-446655440002',
  })
  @IsOptional()
  @IsUUID()
  departmentId?: string;

  @ApiPropertyOptional({
    description: 'Position ID',
    example: '550e8400-e29b-41d4-a716-446655440003',
  })
  @IsOptional()
  @IsUUID()
  positionId?: string;

  @ApiPropertyOptional({
    description: 'Manager ID',
    example: '550e8400-e29b-41d4-a716-446655440004',
  })
  @IsOptional()
  @IsUUID()
  managerId?: string;

  @ApiPropertyOptional({
    description: 'Base salary',
    example: 75000.00,
  })
  @IsOptional()
  @IsDecimal({ decimal_digits: '2' })
  baseSalary?: number;

  @ApiPropertyOptional({
    description: 'Currency',
    example: 'USD',
    default: 'USD',
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(3)
  currency?: string;

  @ApiPropertyOptional({
    description: 'Pay frequency',
    example: 'monthly',
    default: 'monthly',
  })
  @IsOptional()
  @IsString()
  payFrequency?: string;
}