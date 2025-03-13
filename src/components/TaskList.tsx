import { useState } from "react";
import { Task } from "../types";
import TaskTimer from "./TaskTimer";

interface TaskListProps {
  tasks: Task[];
  onAddTask: (name: string) => void;
  onEditTaskName: (taskId: string, newName: string) => void;
  onSaveTime: (taskId: string, duration: number) => void;
  onEditTimeEntry: (
    taskId: string,
    entryId: string,
    newDuration: number
  ) => void;
  onDeleteTimeEntry: (taskId: string, entryId: string) => void;
}

export default function TaskList({
  tasks,
  onAddTask,
  onEditTaskName,
  onSaveTime,
  onEditTimeEntry,
  onDeleteTimeEntry,
}: TaskListProps) {
  const [newTaskName, setNewTaskName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskName.trim()) {
      onAddTask(newTaskName.trim());
      setNewTaskName("");
    }
  };

  return (
    <div className="task-list">
      <h2>Your Tasks</h2>

      <form onSubmit={handleSubmit} className="add-task-form">
        <input
          type="text"
          value={newTaskName}
          onChange={(e) => setNewTaskName(e.target.value)}
          placeholder="Enter a new task name"
          className="task-input"
        />
        <button type="submit" className="add-button">
          Add Task
        </button>
      </form>

      <div className="tasks-container">
        {tasks.length === 0 ? (
          <div className="empty-state">
            <p>No tasks yet. Add your first task to get started!</p>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskTimer
              key={task.id}
              task={task}
              onEditTaskName={onEditTaskName}
              onSaveTime={onSaveTime}
              onEditTimeEntry={onEditTimeEntry}
              onDeleteTimeEntry={onDeleteTimeEntry}
            />
          ))
        )}
      </div>
    </div>
  );
}
