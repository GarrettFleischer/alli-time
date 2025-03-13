import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import "./App.css";
import { Task, TimeEntry } from "./types";
import TaskList from "./components/TaskList";
import { loadTasks, saveTasks } from "./utils/storage";

function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    return loadTasks();
  });

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    try {
      console.log("Saving tasks to localStorage...");
      saveTasks(tasks);
    } catch (error) {
      console.error("Error in save effect:", error);
    }
  }, [tasks]);

  const handleAddTask = (name: string) => {
    const newTask: Task = {
      id: uuidv4(),
      name,
      timeEntries: [],
    };

    console.log("Adding new task:", newTask);
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const handleEditTaskName = (taskId: string, newName: string) => {
    console.log("Editing task name:", taskId, newName);
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, name: newName } : task
      )
    );
  };

  const handleSaveTime = (taskId: string, duration: number) => {
    const newTimeEntry: TimeEntry = {
      id: uuidv4(),
      duration,
      timestamp: Date.now(),
    };

    console.log("Saving time entry:", taskId, newTimeEntry);
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? { ...task, timeEntries: [...task.timeEntries, newTimeEntry] }
          : task
      )
    );
  };

  const handleEditTimeEntry = (
    taskId: string,
    entryId: string,
    newDuration: number
  ) => {
    console.log("Editing time entry:", taskId, entryId, newDuration);
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              timeEntries: task.timeEntries.map((entry) =>
                entry.id === entryId
                  ? { ...entry, duration: newDuration }
                  : entry
              ),
            }
          : task
      )
    );
  };

  const handleDeleteTimeEntry = (taskId: string, entryId: string) => {
    console.log("Deleting time entry:", taskId, entryId);
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              timeEntries: task.timeEntries.filter(
                (entry) => entry.id !== entryId
              ),
            }
          : task
      )
    );
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>AlliTime</h1>
        <p>Track your time, improve your estimates</p>
      </header>

      <main>
        <TaskList
          tasks={tasks}
          onAddTask={handleAddTask}
          onEditTaskName={handleEditTaskName}
          onSaveTime={handleSaveTime}
          onEditTimeEntry={handleEditTimeEntry}
          onDeleteTimeEntry={handleDeleteTimeEntry}
        />
      </main>
    </div>
  );
}

export default App;
