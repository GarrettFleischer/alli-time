import { useState, useEffect } from "react";

interface TimePickerModalProps {
  initialDuration: number; // in milliseconds
  onSave: (duration: number) => void;
  onCancel: () => void;
}

export default function TimePickerModal({
  initialDuration,
  onSave,
  onCancel,
}: TimePickerModalProps) {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  // Initialize time values from initialDuration
  useEffect(() => {
    const totalSeconds = Math.floor(initialDuration / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = Math.floor(totalSeconds % 60);

    setHours(h);
    setMinutes(m);
    setSeconds(s);
  }, [initialDuration]);

  const handleSave = () => {
    // Convert to milliseconds
    const duration = (hours * 3600 + minutes * 60 + seconds) * 1000;
    onSave(duration);
  };

  const increment = (value: number, max: number): number => {
    return value >= max ? 0 : value + 1;
  };

  const decrement = (value: number, max: number): number => {
    return value <= 0 ? max : value - 1;
  };

  // Handle input changes with validation
  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 0 && value <= 23) {
      setHours(value);
    } else if (e.target.value === "") {
      setHours(0);
    }
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 0 && value <= 59) {
      setMinutes(value);
    } else if (e.target.value === "") {
      setMinutes(0);
    }
  };

  const handleSecondsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 0 && value <= 59) {
      setSeconds(value);
    } else if (e.target.value === "") {
      setSeconds(0);
    }
  };

  // Handle clicks outside the modal to cancel
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  return (
    <div className="time-picker-overlay" onClick={handleOverlayClick}>
      <div className="time-picker-modal">
        <h3>Edit Time</h3>

        <div className="time-picker-controls">
          <div className="time-unit">
            <label>Hours</label>
            <div className="number-input-container">
              <button
                className="number-input-button"
                onClick={() => setHours(increment(hours, 23))}
                aria-label="Increment hours"
              >
                +
              </button>
              <input
                type="number"
                className="number-input-value"
                value={hours}
                onChange={handleHoursChange}
                min="0"
                max="23"
                aria-label="Hours"
              />
              <button
                className="number-input-button"
                onClick={() => setHours(decrement(hours, 23))}
                aria-label="Decrement hours"
              >
                -
              </button>
            </div>
          </div>

          <div className="time-separator">:</div>

          <div className="time-unit">
            <label>Minutes</label>
            <div className="number-input-container">
              <button
                className="number-input-button"
                onClick={() => setMinutes(increment(minutes, 59))}
                aria-label="Increment minutes"
              >
                +
              </button>
              <input
                type="number"
                className="number-input-value"
                value={minutes}
                onChange={handleMinutesChange}
                min="0"
                max="59"
                aria-label="Minutes"
              />
              <button
                className="number-input-button"
                onClick={() => setMinutes(decrement(minutes, 59))}
                aria-label="Decrement minutes"
              >
                -
              </button>
            </div>
          </div>

          <div className="time-separator">:</div>

          <div className="time-unit">
            <label>Seconds</label>
            <div className="number-input-container">
              <button
                className="number-input-button"
                onClick={() => setSeconds(increment(seconds, 59))}
                aria-label="Increment seconds"
              >
                +
              </button>
              <input
                type="number"
                className="number-input-value"
                value={seconds}
                onChange={handleSecondsChange}
                min="0"
                max="59"
                aria-label="Seconds"
              />
              <button
                className="number-input-button"
                onClick={() => setSeconds(decrement(seconds, 59))}
                aria-label="Decrement seconds"
              >
                -
              </button>
            </div>
          </div>
        </div>

        <div className="time-picker-actions">
          <button className="save-button" onClick={handleSave}>
            Save
          </button>
          <button className="cancel-button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
