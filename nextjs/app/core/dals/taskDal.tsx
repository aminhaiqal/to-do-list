"use server"

import { prisma } from "@/app/actions/prisma"
import { TaskType } from "@prisma/client";

// Create a new task
export const createTask = async (taskData: {
    activity: string;
    price: number;
    type: TaskType;
    bookingRequired: boolean;
    accessibility: number;
  }) => {
    return await prisma.task.create({
      data: taskData,
    });
  };

// Get a task by ID
export const getTaskById = async (id: number) => {
    return await prisma.task.findUnique({
      where: { id },
    });
  };

// Get all tasks
export const getAllTasks = async () => {
    return await prisma.task.findMany();
  };

// Update a task by ID
export const updateTask = async (
    id: number,
    updatedData: {
      activity?: string;
      price?: number;
      type?: TaskType;
      bookingRequired?: boolean;
      accessibility?: number;
    }
  ) => {
    return await prisma.task.update({
      where: { id },
      data: updatedData,
    });
  };

// Delete a task by ID
export const deleteTask = async (id: number) => {
    return await prisma.task.delete({
      where: { id },
    });
  };