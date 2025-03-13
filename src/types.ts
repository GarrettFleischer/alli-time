export interface TimeEntry {
  id: string;
  duration: number; // Duration in milliseconds
  timestamp: number; // When the entry was created
}

export interface Task {
  id: string;
  name: string;
  timeEntries: TimeEntry[]; // Array of time entries
}

export interface TasksState {
  tasks: Task[];
}
