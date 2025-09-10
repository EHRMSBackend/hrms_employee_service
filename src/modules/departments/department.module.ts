import { Module } from "@nestjs/common";
import { PrismaModule } from "src/db/prisma.module";
import { DepartmentController } from "./department.controller";
import { DepartmentService } from "./department.service";

@Module({
imports: [PrismaModule],
controllers:[DepartmentController],
providers:[DepartmentService]
})
export class DepartmentModule{}