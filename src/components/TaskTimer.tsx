import { useState, useEffect } from "react";
import { Task, TimeEntry } from "../types";
import TimePickerModal from "./TimePickerModal";

interface TaskTimerProps {
  task: Task;
  onEditTaskName: (taskId: string, newName: string) => void;
  onSaveTime: (taskId: string, duration: number) => void;
  onEditTimeEntry: (
    taskId: string,
    entryId: string,
    newDuration: number
  ) => void;
  onDeleteTimeEntry: (taskId: string, entryId: string) => void;
}

export default function TaskTimer({
  task,
  onEditTaskName,
  onSaveTime,
  onEditTimeEntry,
  onDeleteTimeEntry,
}: TaskTimerProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showTimeEntries, setShowTimeEntries] = useState(false);
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [editingEntryDuration, setEditingEntryDuration] = useState<number>(0);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(task.name);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;

    if (isRunning) {
      intervalId = setInterval(() => {
        if (startTime) {
          setElapsedTime(Date.now() - startTime);
        }
      }, 100);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isRunning, startTime]);

  // Update editedName when task name changes
  useEffect(() => {
    setEditedName(task.name);
  }, [task.name]);

  const formatTime = (ms: number): string => {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor(ms / (1000 * 60 * 60));

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleStartStop = () => {
    if (isRunning) {
      // Stop the timer
      setIsRunning(false);
      if (startTime) {
        const duration = Date.now() - startTime;
        onSaveTime(task.id, duration);
      }
      setStartTime(null);
      setElapsedTime(0);
    } else {
      // Start the timer
      setIsRunning(true);
      setStartTime(Date.now());
    }
  };

  const calculateAverage = (): string => {
    if (task.timeEntries.length === 0) return "No data";

    const total = task.timeEntries.reduce(
      (sum, entry) => sum + entry.duration,
      0
    );
    const avg = total / task.timeEntries.length;

    return formatTime(avg);
  };

  const handleEditClick = (entry: TimeEntry) => {
    setEditingEntryId(entry.id);
    setEditingEntryDuration(entry.duration);
  };

  const handleSaveEdit = (newDuration: number) => {
    if (editingEntryId && newDuration > 0) {
      onEditTimeEntry(task.id, editingEntryId, newDuration);
    }
    setEditingEntryId(null);
  };

  const handleCancelEdit = () => {
    setEditingEntryId(null);
  };

  const handleNameClick = () => {
    if (!isRunning) {
      setIsEditingName(true);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedName(e.target.value);
  };

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editedName.trim()) {
      onEditTaskName(task.id, editedName.trim());
    } else {
      setEditedName(task.name); // Reset to original if empty
    }
    setIsEditingName(false);
  };

  const handleNameBlur = () => {
    handleNameSubmit({ preventDefault: () => {} } as React.FormEvent);
  };

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleString();
  };

  // Sort time entries by timestamp (most recent first)
  const sortedTimeEntries = [...task.timeEntries].sort(
    (a, b) => b.timestamp - a.timestamp
  );

  return (
    <div className="task-timer">
      <div className="task-info">
        {isEditingName ? (
          <form onSubmit={handleNameSubmit} className="edit-name-form">
            <input
              type="text"
              value={editedName}
              onChange={handleNameChange}
              onBlur={handleNameBlur}
              autoFocus
              className="edit-name-input"
            />
          </form>
        ) : (
          <h3 onClick={handleNameClick} className="task-name">
            {task.name}
          </h3>
        )}
        <div className="task-stats">
          <span className="average-time">Average: {calculateAverage()}</span>
        </div>
      </div>

      <div className="timer-controls">
        <div className="timer-display">
          {isRunning ? formatTime(elapsedTime) : "00:00:00"}
        </div>
        <button
          className={`timer-button ${isRunning ? "stop" : "start"}`}
          onClick={handleStartStop}
        >
          {isRunning ? "STOP" : "START"}
        </button>
      </div>

      {task.timeEntries.length > 0 && (
        <button
          className="toggle-entries-button"
          onClick={() => setShowTimeEntries(!showTimeEntries)}
          aria-label={
            showTimeEntries ? "Hide time entries" : "Show time entries"
          }
        >
          <span className="chevron-icon">{showTimeEntries ? "▲" : "▼"}</span>
        </button>
      )}

      {showTimeEntries && (
        <div className="time-entries-list">
          <h4>Time Entries</h4>
          <ul>
            {sortedTimeEntries.map((entry) => (
              <li key={entry.id} className="time-entry-item">
                <div className="entry-details">
                  <span className="entry-duration">
                    {formatTime(entry.duration)}
                  </span>
                  <span className="entry-date">
                    {formatDate(entry.timestamp)}
                  </span>
                  <div className="entry-actions">
                    <button
                      className="edit-button"
                      onClick={() => handleEditClick(entry)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => onDeleteTimeEntry(task.id, entry.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {editingEntryId && (
        <TimePickerModal
          initialDuration={editingEntryDuration}
          onSave={handleSaveEdit}
          onCancel={handleCancelEdit}
        />
      )}
    </div>
  );
}
