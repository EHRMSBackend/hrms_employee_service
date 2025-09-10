// 1. LeaveRequest

// DTOs
import {
  IsString,
  IsDateString,
  IsDecimal,
  IsOptional,
  IsEnum,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

export class CreateLeaveRequestDto {
  @ApiProperty({ description: 'The ID of the company', example: 'uuid-string' })
  @IsString()
  companyId: string;

  @ApiProperty({
    description: 'The ID of the employee',
    example: 'uuid-string',
  })
  @IsString()
  employeeId: string;

  @ApiProperty({
    description: 'Type of leave',
    example: 'vacation',
    enum: ['vacation', 'sick', 'personal', 'maternity', 'paternity'],
  })
  @IsEnum(['vacation', 'sick', 'personal', 'maternity', 'paternity'])
  leaveType: string;

  @ApiProperty({
    description: 'Start date of leave (ISO date string)',
    example: '2025-09-10',
  })
  @IsDateString()
  startDate: string;

  @ApiProperty({
    description: 'End date of leave (ISO date string)',
    example: '2025-09-15',
  })
  @IsDateString()
  endDate: string;

  @ApiProperty({ description: 'Total days of leave', example: '5.0' })
  @IsDecimal()
  totalDays: Prisma.Decimal;

  @ApiProperty({
    description: 'Reason for leave',
    example: 'Family vacation',
    required: false,
  })
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiProperty({
    description: 'Status of the request',
    example: 'pending',
    required: false,
  })
  @IsOptional()
  @IsEnum(['pending', 'approved', 'rejected', 'cancelled'])
  status?: string;

  @ApiProperty({
    description: 'Date requested (ISO datetime)',
    example: '2025-09-07T00:00:00Z',
  })
  @IsDateString()
  requestedAt: string;

  @ApiProperty({
    description: 'Leave balance before',
    example: '10.0',
    required: false,
  })
  @IsOptional()
  @IsDecimal()
  leaveBalanceBefore?: Prisma.Decimal;

  @ApiProperty({
    description: 'Leave balance after',
    example: '5.0',
    required: false,
  })
  @IsOptional()
  @IsDecimal()
  leaveBalanceAfter?: Prisma.Decimal;
}
