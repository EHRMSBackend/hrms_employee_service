/*
  Warnings:

  - The `subscription_status` column on the `companies` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `billing_cycle` column on the `companies` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."SubscriptionStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."BillingCycle" AS ENUM ('MONTHLY', 'YEARLY');

-- AlterTable
ALTER TABLE "public"."companies" DROP COLUMN "subscription_status",
ADD COLUMN     "subscription_status" "public"."SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
DROP COLUMN "billing_cycle",
ADD COLUMN     "billing_cycle" "public"."BillingCycle" NOT NULL DEFAULT 'MONTHLY';

-- CreateIndex
CREATE INDEX "companies_subscription_status_subscription_plan_idx" ON "public"."companies"("subscription_status", "subscription_plan");
