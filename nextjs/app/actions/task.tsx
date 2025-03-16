"use server";

import { createTask, getTaskById, getAllTasks, updateTask, deleteTask } from "@/app/core/dals/taskDal";
import { TaskType } from "@prisma/client";

export const handleCreateTask = async (taskData: {
  activity: string;
  price: number;
  type: TaskType;
  bookingRequired: boolean;
  accessibility: number;
}) => {
  try {
    return await createTask(taskData);
  } catch (error) {
    console.error("Error creating task:", error);
    return { error: "Failed to create task" };
  }
};

export const handleGetTaskById = async (id: number) => {
  try {
    const task = await getTaskById(id);
    return task ?? { error: "Task not found" };
  } catch (error) {
    console.error("Error fetching task by ID:", error);
    return { error: "Failed to fetch task" };
  }
};

export const handleGetAllTasks = async () => {
  try {
    return await getAllTasks();
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return { error: "Failed to fetch tasks" };
  }
};

export const handleUpdateTask = async (
  id: number,
  updatedData: Partial<{
    activity: string;
    price: number;
    type: TaskType;
    bookingRequired: boolean;
    accessibility: number;
  }>
) => {
  try {
    return await updateTask(id, updatedData);
  } catch (error) {
    console.error("Error updating task:", error);
    return { error: "Failed to update task" };
  }
};

export const handleDeleteTask = async (id: number) => {
  try {
    await deleteTask(id);
    return { success: true };
  } catch (error) {
    console.error("Error deleting task:", error);
    return { error: "Failed to delete task" };
  }
};
