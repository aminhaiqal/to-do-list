import { create } from "zustand";

interface Task {
  id: number;
  activity: string;
  price: number;
  type: string;
  bookingRequired: boolean;
  accessibility: number;
}

interface TaskStore {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  setTasks: (tasks) => set({ tasks }),
}));
