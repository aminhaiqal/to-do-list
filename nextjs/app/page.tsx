"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createTask, getAllTasks, deleteTask, updateTask } from "@/app/core/dals/taskDal";
import { TaskType } from "@prisma/client";
import { useTaskStore } from "@/app/store/taskStore";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

// Task form interface
interface TaskFormData {
  activity: string;
  price: number;
  type: TaskType;
  bookingRequired: boolean;
  accessibility: number;
}

// Task component
export default function Home() {
  const { register, handleSubmit, reset, setValue, watch } = useForm<TaskFormData>({
    defaultValues: {
      activity: "",
      price: 0,
      type: TaskType.EDUCATION,
      bookingRequired: false,
      accessibility: 0.5,
    },
  });
  const queryClient = useQueryClient();
  const { tasks, setTasks } = useTaskStore(); // Zustand for state persistence
  const [editingTask, setEditingTask] = useState<number | null>(null);

  // Fetch tasks
  const { data: tasksData } = useQuery({
    queryKey: ["tasks"],
    queryFn: getAllTasks,
  });

  // Create task mutation
  const createTaskMutation = useMutation({
    mutationFn: createTask,
    onSuccess: (newTask) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setTasks([...tasks, newTask]); // Update local store
      reset(); // Reset form
    },
  });

  // Update task mutation
  const updateTaskMutation = useMutation({
    mutationFn: ({ id, updatedData }: { id: number; updatedData: TaskFormData }) => updateTask(id, updatedData),
    onSuccess: (_, { id, updatedData }) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setTasks(tasks.map((task) => (task.id === id ? { ...task, ...updatedData } : task)));
      setEditingTask(null);
      reset();
    },
  });

  // Delete task mutation
  const deleteTaskMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setTasks(tasks.filter((task) => task.id !== id));
    },
  });

  // Handle form submission
  const onSubmit = (data: TaskFormData) => {
    if (editingTask !== null) {
      // If editing, update the existing task
      updateTaskMutation.mutate({
        id: editingTask,
        updatedData: {
          ...data,
          price: parseFloat(data.price as unknown as string),
        },
      });
    } else {
      // Otherwise, create a new task
      createTaskMutation.mutate({
        ...data,
        price: parseFloat(data.price as unknown as string),
      });
    }
  };
  

  const handleEdit = (task: any) => {
    setEditingTask(task.id);
    setValue("activity", task.activity);
    setValue("price", task.price);
    setValue("type", task.type);
    setValue("bookingRequired", task.bookingRequired);
    setValue("accessibility", task.accessibility);
  };

  // Sync Zustand state with database on page load
  useEffect(() => {
    if (tasksData) setTasks(tasksData);
  }, [tasksData, setTasks]);

  return (
    <div className="max-w-lg mx-auto space-y-6">
      {/* Total Task Count */}
      <h2 className="text-xl font-bold">Total Tasks: {tasks.length}</h2>

      {/* Task Form */}
      <Card>
        <CardContent className="p-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Activity */}
            <div>
              <Label>Activity</Label>
              <Input {...register("activity", { required: true })} />
            </div>

            {/* Price */}
            <div>
              <Label>Price</Label>
              <Input type="number" {...register("price", { required: true })} />
            </div>

            {/* Type (Dropdown) */}
            <div>
              <Label>Type</Label>
              <Select onValueChange={(value) => setValue("type", value as TaskType)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select task type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(TaskType).map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

            </div>

            {/* Booking Required (Checkbox) */}
            <div className="flex items-center space-x-2">
              <Checkbox onCheckedChange={(checked) => setValue("bookingRequired", checked as boolean)} />
              <Label>Booking Required</Label>
            </div>

            {/* Accessibility (Slider) */}
            <div>
              <Label>Accessibility</Label>
              <Slider
                defaultValue={[0.5]}
                min={0}
                max={1}
                step={0.1}
                onValueChange={(value) => setValue("accessibility", value[0])}
              />
              <p>Value: {watch("accessibility")}</p>
            </div>

            {/* Submit Button */}
            <Button type="submit" disabled={createTaskMutation.isPending || updateTaskMutation.isPending}>
              {editingTask
                ? updateTaskMutation.isPending
                  ? "Updating..."
                  : "Update Task"
                : createTaskMutation.isPending
                  ? "Adding..."
                  : "Add Task"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Task List */}
      <div className="space-y-4">
        {tasks.map((task) => (
          <Card key={task.id}>
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="font-semibold">{task.activity}</p>
                <p>Price: ${task.price}</p>
                <p>Type: {task.type}</p>
                <p>Booking Required: {task.bookingRequired ? "Yes" : "No"}</p>
                <p>Accessibility: {task.accessibility}</p>
              </div>
              <div className="space-x-2">
                <Button onClick={() => handleEdit(task)}>Edit</Button>
                <Button variant="destructive" onClick={() => deleteTaskMutation.mutate(task.id)}>
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
