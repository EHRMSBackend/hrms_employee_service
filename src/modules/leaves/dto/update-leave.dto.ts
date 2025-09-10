
// DTOs
import { IsString, IsDateString, IsDecimal, IsOptional, IsEnum, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

export class UpdateLeaveRequestDto {
  @ApiProperty({ description: 'Type of leave', example: 'sick', required: false })
  @IsOptional()
  @IsEnum(['vacation', 'sick', 'personal', 'maternity', 'paternity'])
  leaveType?: string;

  @ApiProperty({ description: 'Start date of leave (ISO date string)', example: '2025-09-10', required: false })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({ description: 'End date of leave (ISO date string)', example: '2025-09-15', required: false })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({ description: 'Total days of leave', example: '5.0', required: false })
  @IsOptional()
  @IsDecimal()
  totalDays?: Prisma.Decimal;

  @ApiProperty({ description: 'Reason for leave', example: 'Family vacation', required: false })
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiProperty({ description: 'Status of the request', example: 'approved', required: false })
  @IsOptional()
  @IsEnum(['pending', 'approved', 'rejected', 'cancelled'])
  status?: string;

  @ApiProperty({ description: 'ID of the approver', example: 'uuid-string', required: false })
  @IsOptional()
  @IsString()
  approvedById?: string;

  @ApiProperty({ description: 'Date approved (ISO datetime)', example: '2025-09-08T00:00:00Z', required: false })
  @IsOptional()
  @IsDateString()
  approvedAt?: string;

  @ApiProperty({ description: 'Rejection reason', example: 'Not enough balance', required: false })
  @IsOptional()
  @IsString()
  rejectionReason?: string;

  @ApiProperty({ description: 'Leave balance before', example: '10.0', required: false })
  @IsOptional()
  @IsDecimal()
  leaveBalanceBefore?: Prisma.Decimal;

  @ApiProperty({ description: 'Leave balance after', example: '5.0', required: false })
  @IsOptional()
  @IsDecimal()
  leaveBalanceAfter?: Prisma.Decimal;
}