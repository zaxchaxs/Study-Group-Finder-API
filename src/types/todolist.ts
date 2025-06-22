export interface TodolistType {
  id: number
  userId: number
  title: string
  description: string
  status: "completed" | "progress" | "uncompleted"
  priority: number
  icon: string
  deadline: string
  createdAt: string
  updatedAt: string
};

export interface PostTodolistType {
    userId: number;
    title: string
    description: string
    status: "completed" | "progress" | "uncompleted"
    priority: number
    icon: string
    deadline: string
};

export interface UpdateTodolistType {
    title: string
    description: string
    status: "completed" | "progress" | "uncompleted"
    priority: number
    icon: string
    deadline: string
};