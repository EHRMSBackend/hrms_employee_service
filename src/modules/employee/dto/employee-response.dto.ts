import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

export class EmployeeResponseDto {
  @ApiProperty({
    description: 'Employee ID',
    example: '550e8400-e29b-41d4-a716-446655440005',
  })
  id: string;

  @ApiProperty({
    description: 'Company ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  companyId: string;

  @ApiPropertyOptional({
    description: 'User ID',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  userId?: any;

  @ApiProperty({
    description: 'Company internal employee ID',
    example: 'EMP001',
  })
  employeeId: string;

  @ApiProperty({
    description: 'First name',
    example: 'John',
  })
  firstName: string;

  @ApiProperty({
    description: 'Last name',
    example: 'Doe',
  })
  lastName: string;

  @ApiProperty({
    description: 'Email address',
    example: 'john.doe@company.com',
  })
  email: string;

  @ApiPropertyOptional({
    description: 'Phone number',
    example: '+1234567890',
  })
  phone?: any;

  @ApiProperty({
    description: 'Hire date',
    example: '2024-01-15T00:00:00.000Z',
  })
  hireDate: Date;

  @ApiProperty({
    description: 'Employment status',
    example: 'active',
  })
  employmentStatus: string;

  @ApiProperty({
    description: 'Employment type',
    example: 'full_time',
  })
  employmentType: string;

  @ApiPropertyOptional({
    description: 'Base salary',
    example: 75000.00,
  })
  baseSalary?: any;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-01-15T10:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-01-15T10:30:00.000Z',
  })
  updatedAt: Date;
}