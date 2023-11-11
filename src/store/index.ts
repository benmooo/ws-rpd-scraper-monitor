import { create } from "zustand";

export interface Worker {
  name: string;
}

export interface Task {
  id: number;
  value: String;
  retry: number;
}

export interface Store {
  workers: Worker[];
  appendWorker: (worker: Worker) => void;
  removeWorker: (worker: Worker) => void;

  tasks: Task[];
  appendTask: (task: Task) => void;
  removeTask: (task: Task) => void;

  socket: WebSocket;
  setSocket: (socket: WebSocket) => void;
  closeSocket: () => void;
}

export const useStore = create<Store>()((set) => ({
  workers: [],
  appendWorker: (worker: Worker) =>
    set((state) => ({ workers: [...state.workers, worker] })),
  removeWorker: (worker: Worker) =>
    set((state) => ({
      workers: state.workers.filter((w) => w.name !== worker.name),
    })),
  setWorkers: (workers: Worker[]) => set(() => ({ workers })),

  tasks: [],
  appendTask: (task: Task) =>
    set((state) => ({ tasks: [...state.tasks, task] })),
  removeTask: (task: Task) =>
    set((state) => ({
      tasks: state.tasks.filter((w) => w.id !== task.id),
    })),
  setTasks: (tasks: Task[]) => set(() => ({ tasks })),

  socket: new WebSocket("ws://localhost:3030/ws-channel"),
  setSocket: (socket: WebSocket) => set(() => ({ socket })),
  closeSocket: () =>
    set((state) => {
      state.socket.close();
      return {};
    }),
}));

export enum MessageType {
  WorkerConnected,
  WorkerOffline,
  TaskInProcss,
  TaskCompleted,
  TaskFailed,
}

export interface Message {
  type: MessageType;
  payload: {
    worker: Worker;
    task: Task | null;
  };
}
