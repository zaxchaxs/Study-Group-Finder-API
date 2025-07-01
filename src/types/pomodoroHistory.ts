export interface PomodoroHistoryType {
  id: number;
  userId: number;
  duration: number;
  session: number;
  type: "work" | "break";
  createdAt: string;
  updateAt: string;
}

export interface PostPomodoroHistoryType {
  id: number;
  userId: number;
  duration: number;
  session: number | 0;
  type: "work" | "break";
}

export interface UpdatePomodoroHistoryType {
  id: number;
  userId: number;
  duration: number;
  session: number | 0;
  type: "work" | "break";
}

