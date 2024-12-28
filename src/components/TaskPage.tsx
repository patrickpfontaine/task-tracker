"use client";

import React, { useState, useRef } from "react";
import { AddTaskButton } from "./AddTaskButton";
import { Task } from "../types/task";

interface StatCardProps {
  title: string;
  value: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value }) => (
  <div className="bg-white p-4 rounded-lg shadow-md text-center flex-1 mx-2">
    <h2 className="text-xl font-semibold text-gray-700">{title}</h2>
    <p className="text-3xl font-bold text-gray-900">{value}</p>
  </div>
);

interface TaskColumnProps {
  title: string;
  tasks: Task[];
  onAddTask?: (task: Task) => void;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, status: string) => void;
}

const TaskColumn: React.FC<TaskColumnProps> = ({
  title,
  tasks,
  onAddTask,
  onDragStart,
  onDragOver,
  onDrop,
}) => (
  <div
    className="bg-white rounded-lg shadow-md flex-1 mx-2 p-4 flex flex-col h-full"
    onDragOver={onDragOver}
    onDrop={(e) => onDrop(e, title)}
  >
    <h2 className="text-xl font-semibold mb-4">{title}</h2>
    {tasks.map((task) => (
      <div
        key={task.id}
        draggable
        onDragStart={(e) => onDragStart(e, task.id)}
        className="bg-gray-100 p-2 mb-2 rounded cursor-move"
      >
        <p className="font-semibold">{task.title}</p>
        <p className="text-sm text-gray-600">ETA: {task.eta}</p>
      </div>
    ))}
    {title === "To Do" && onAddTask && (
      <AddTaskButton className="mt-auto" onAddTask={onAddTask}>
        Add Task
      </AddTaskButton>
    )}
  </div>
);

const TaskPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const draggedTask = useRef<string | null>(null);

  const addTask = (task: Task) => {
    setTasks([...tasks, task]);
  };

  const onDragStart = (e: React.DragEvent, taskId: string) => {
    draggedTask.current = taskId;
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const onDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    if (draggedTask.current) {
      const updatedTasks = tasks.map((task) =>
        task.id === draggedTask.current ? { ...task, status: newStatus } : task
      );
      setTasks(updatedTasks);
      draggedTask.current = null;
    }
  };

  const getTotalEta = () => {
    const totalMinutes = tasks.reduce((total, task) => {
      if (task.eta.includes(":")) {
        const [hours, minutes] = task.eta.split(":").map(Number);
        return total + hours * 60 + minutes;
      } else {
        return total + parseInt(task.eta, 10);
      }
    }, 0);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (minutes != 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${hours}h`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#4A4771] to-[#8AAAE5] flex flex-col p-4 md:p-8">
      <header className="mb-4 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          Task Tracker
        </h1>
      </header>
      <div className="flex flex-col md:flex-row justify-between mb-4 md:mb-8">
        <StatCard title="Total Tasks" value={tasks.length.toString()} />
        <StatCard title="Total Time ETA" value={getTotalEta()} />
      </div>
      <div className="flex flex-col md:flex-row h-full md:h-[600px] space-y-4 md:space-y-0">
        <TaskColumn
          title="To Do"
          tasks={tasks.filter((task) => task.status === "To Do")}
          onAddTask={addTask}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDrop={onDrop}
        />
        <TaskColumn
          title="In Progress"
          tasks={tasks.filter((task) => task.status === "In Progress")}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDrop={onDrop}
        />
        <TaskColumn
          title="Done"
          tasks={tasks.filter((task) => task.status === "Done")}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDrop={onDrop}
        />
      </div>
    </div>
  );
};

export default TaskPage;
