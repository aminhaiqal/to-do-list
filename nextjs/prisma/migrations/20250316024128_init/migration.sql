-- CreateEnum
CREATE TYPE "TaskType" AS ENUM ('EDUCATION', 'RECREATIONAL', 'SOCIAL', 'DIY', 'CHARITY', 'COOKING', 'RELAXATION', 'MUSIC', 'BUSYWORK');

-- CreateTable
CREATE TABLE "Task" (
    "id" SERIAL NOT NULL,
    "activity" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "type" "TaskType" NOT NULL,
    "bookingRequired" BOOLEAN NOT NULL,
    "accessibility" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);
