export interface TodolistType {
  id: number
  userId: number
  title: string
  description: string
  status: "completed" | "progress" | "uncompleted"
  priority: number
  icon: string
  deadline: string
  color: string
  isChecked: boolean
  createdAt: string
  updatedAt: string
};

export interface PostTodolistType {
    userId: number;
    title: string
    description: string
    status: "completed" | "progress" | "uncompleted"
    priority: number
    icon: string;
    deadline: string
    isChecked: boolean
    color: "cyan" | 'dark_blue' | 'yellow' | 'black' | 'sage',
};

export interface UpdateTodolistType {
    title: string
    description: string
    status: "completed" | "progress" | "uncompleted"
    priority: number
    icon: string
    deadline: string
    isChecked: boolean
    color: "cyan" | 'dark_blue' | 'yellow' | 'black' | 'sage',
};