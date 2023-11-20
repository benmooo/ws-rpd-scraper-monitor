import { create } from "zustand";

export interface Worker {
  id: string;
  name: string;
  delaySecondsRange: [number, number];
  status: WorkerStatus;
  credentials: WorkerCredentials;
  proxy: string | null;
  endpoint: string | null;
  userId: string;
  deptIds: string;
}
interface WorkerCredentials {
  authorization: string;
  cookie: string;
  userAgent: string | null;
}

enum WorkerStatus {
  Connected = "Connected",
  Working = "Working",
  Idle = "Idle",
  Offline = "Offline",
}

type Theme = "dark" | "light" | "system";
export interface Task {
  id: number;
  value: String;
  retry: number;
  status: TaskStatus;
}

export interface Store {
  workers: Worker[];
  appendWorker: (worker: Worker) => void;
  removeWorker: (worker: Worker) => void;
  setWorkers: (workers: Worker[]) => void;

  workerMessage: Message[];
  updateWorkerMessage: (message: Message) => void;

  todoTasks: Task[];
  appendTodoTask: (task: Task) => void;
  removeTodoTask: (task: Task) => void;
  setTodoTasks: (tasks: Task[]) => void;

  inProcessTasks: Task[];
  appendInProcessTask: (task: Task) => void;
  removeInProcessTask: (task: Task) => void;
  setInProcessTasks: (tasks: Task[]) => void;

  completeTasks: Task[];
  appendCompleteTask: (task: Task) => void;
  removeCompleteTask: (task: Task) => void;
  setCompleteTasks: (tasks: Task[]) => void;

  failTasks: Task[];
  appendFailTask: (task: Task) => void;
  removeFailTask: (task: Task) => void;
  setFailTasks: (tasks: Task[]) => void;

  socket: WebSocket;
  setSocket: (socket: WebSocket) => void;
  closeSocket: () => void;

  clientId: string | null;
  setClientId: (id: string) => void;

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
        (msg) => msg.payload.worker?.id !== message.payload.worker?.id
      );

      const msg =
        message.type === MessageType.WorkerOffline
          ? filtered
          : [...filtered, message];

      let sorted = msg.sort((a, b) =>
        a.payload.worker!.name.localeCompare(b.payload.worker!.name)
      );

      return { workerMessage: sorted };
    }),

  todoTasks: [],
  appendTodoTask: (task: Task) =>
    set((state) => ({ todoTasks: [...state.todoTasks, task] })),
  removeTodoTask: (target: Task) =>
    set((state) => ({
      todoTasks: state.todoTasks.filter((task) => task.id !== target.id),
    })),
  setTodoTasks: (todoTasks: Task[]) => set(() => ({ todoTasks })),

  inProcessTasks: [],
  appendInProcessTask: (task: Task) =>
    set((state) => ({ inProcessTasks: [...state.inProcessTasks, task] })),
  removeInProcessTask: (target: Task) =>
    set((state) => ({
      inProcessTasks: state.inProcessTasks.filter(
        (task) => task.id !== target.id
      ),
    })),
  setInProcessTasks: (inProcessTasks: Task[]) =>
    set(() => ({ inProcessTasks })),

  completeTasks: [],
  appendCompleteTask: (task: Task) =>
    set((state) => ({ completeTasks: [...state.completeTasks, task] })),
  removeCompleteTask: (target: Task) =>
    set((state) => ({
      completeTasks: state.completeTasks.filter(
        (task) => task.id !== target.id
      ),
    })),
  setCompleteTasks: (completeTasks: Task[]) => set(() => ({ completeTasks })),

  failTasks: [],
  appendFailTask: (task: Task) =>
    set((state) => ({ failTasks: [...state.failTasks, task] })),
  removeFailTask: (target: Task) =>
    set((state) => ({
      failTasks: state.failTasks.filter((task) => task.id !== target.id),
    })),
  setFailTasks: (failTasks: Task[]) => set(() => ({ failTasks })),

  socket: new WebSocket("ws://localhost:3000/ws"),
  setSocket: (socket: WebSocket) => set(() => ({ socket })),
  closeSocket: () =>
    set((state) => {
      state.socket.close();
      return {};
    }),

  clientId: null,
  setClientId: (clientId: string) =>
    set((state) => {
      if (!state.clientId) return { clientId };
      return { clientId: state.clientId };
    }),

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
  ClientLeft = "ClientLeft",
}

export interface Message {
  type: MessageType;
  payload: {
    worker: Worker | null;
    task: Task | null;
    client: { id: string; message: string | null } | null;
    err: string | null;
  };
}
export enum TaskStatus {
  NotTaken = "NotTaken",
  InProcess = "InProcess",
  Complete = "Complete",
  Fail = "Fail",
}
