"use client";

import React, { useState } from "react";
import { Task } from "../types/task";

interface AddTaskButtonProps {
  onAddTask: (task: Task) => void;
  children: React.ReactNode;
  className?: string;
}

export const AddTaskButton: React.FC<AddTaskButtonProps> = ({
  onAddTask,
  children,
  className,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskEta, setTaskEta] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskTitle && taskEta) {
      let formattedEta = taskEta;
      if (!taskEta.includes(":")) {
        formattedEta = `0:${taskEta.padStart(2, "0")}`;
      }
      onAddTask({
        id: Date.now().toString(),
        title: taskTitle,
        eta: formattedEta,
        status: "To Do",
      });
      setTaskTitle("");
      setTaskEta("");
      setIsAdding(false);
    }
  };

  if (isAdding) {
    return (
      <form onSubmit={handleSubmit} className={`mt-4 ${className}`}>
        <label htmlFor="taskTitle" className="sr-only">
          Task Title
        </label>
        <input
          id="taskTitle"
          type="text"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          placeholder="Task title"
          className="w-full p-2 mb-2 border rounded"
          required
        />
        <label htmlFor="taskEta" className="sr-only">
          Task ETA
        </label>
        <input
          id="taskEta"
          type="text"
          value={taskEta}
          onChange={(e) => setTaskEta(e.target.value)}
          placeholder="ETA (e.g., 4:30 or 30)"
          className="w-full p-2 mb-2 border rounded"
          required
        />
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setIsAdding(false)}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add
          </button>
        </div>
      </form>
    );
  }

  return (
    <button
      onClick={() => setIsAdding(true)}
      className={`bg-blue-500 text-white px-4 py-2 rounded ${className}`}
    >
      {children}
    </button>
  );
};
