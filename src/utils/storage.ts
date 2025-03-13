import { Task } from "../types";

const STORAGE_KEY = "alli-time-tasks";

export const loadTasks = (): Task[] => {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      const parsedData = JSON.parse(storedData);

      // If it's an array of tasks
      if (Array.isArray(parsedData)) {
        return parsedData as Task[];
      }
    }
  } catch (error) {
    console.error("Error loading tasks from localStorage:", error);
    // If there's an error, clear the corrupted data
    localStorage.removeItem(STORAGE_KEY);
  }
  return [];
};

export const saveTasks = (tasks: Task[]): void => {
  try {
    // Save directly as an array for simplicity
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));

    // Log success to verify it's working
    console.log("Tasks saved successfully:", tasks.length, "tasks");
  } catch (error) {
    console.error("Error saving tasks to localStorage:", error);
  }
};
