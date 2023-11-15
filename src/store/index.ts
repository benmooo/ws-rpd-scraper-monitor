import { create } from "zustand";

export interface Worker {
  name: string;
}

type Theme = "dark" | "light" | "system";
export interface Task {
  id: number;
  value: String;
  retry: number;
}

export interface Store {
  workers: Worker[];
  appendWorker: (worker: Worker) => void;
  removeWorker: (worker: Worker) => void;
  setWorkers: (workers: Worker[]) => void;

  workerMessage: Message[];
  updateWorkerMessage: (message: Message) => void;

  tasks: Task[];
  appendTask: (task: Task) => void;
  removeTask: (task: Task) => void;

  socket: WebSocket;
  setSocket: (socket: WebSocket) => void;
  closeSocket: () => void;

  clientId: number | null;
  setClientId: (id: number) => void;

  theme: Theme;
  setTheme: (theme: Theme) => void;

  messageList: Message[];
  setMessageList: (messageList: Message[]) => void;
  appendMessage: (message: Message) => void;
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

  workerMessage: [],
  updateWorkerMessage: (message: Message) =>
    set(({ workerMessage }) => {
      // filter out the message that contains the worker
      const filtered = workerMessage.filter(
        (msg) => msg.payload.worker?.name != message.payload.worker?.name
      );

      let sorted = [...filtered, message].sort((a, b) =>
        a.payload.worker!.name.localeCompare(b.payload.worker!.name)
      );

      return { workerMessage: sorted };
    }),

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

  clientId: null,
  setClientId: (clientId: number) => set(() => ({ clientId })),

  theme: "light",
  setTheme: (theme: Theme) => set(() => ({ theme })),
  messageList: [],
  setMessageList: (messageList: Message[]) => set(() => ({ messageList })),
  appendMessage: (message: Message) =>
    set((state) => ({ messageList: [...state.messageList, message] })),
}));

export enum MessageType {
  WorkerConnected = "WorkerConnected",
  WorkerOffline = "WorkerOffline",
  TaskInProcess = "TaskInProcess",
  TaskCompleted = "TaskCompleted",
  TaskFailed = "TaskFailed",
  HelloClient = "HelloClient",
  ClientMessage = "ClientMessage",
}

export interface Message {
  type: MessageType;
  payload: {
    worker: Worker | null;
    task: Task | null;
    client: { id: number; message: string | null } | null;
  };
}
