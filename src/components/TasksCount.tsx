import { Message, MessageType, Task, TaskStatus, useStore } from "@/store";
import { Card, CardContent } from "./ui/card";
import {
  Circle,
  CircleDashed,
  CheckCircleIcon,
  CircleSlash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import axios from "axios";

function TasksCount() {
  const {
    todoTasks,
    inProcessTasks,
    completeTasks,
    failTasks,
    setTodoTasks,
    removeTodoTask,
    setInProcessTasks,
    appendInProcessTask,
    removeInProcessTask,

    setCompleteTasks,
    appendCompleteTask,

    setFailTasks,
    appendFailTask,
    socket,
  } = useStore();

  const fetchTasks = async (category: TaskStatus) => {
    const res = await axios.get(
      `http://localhost:3000/tasks?category=${category}`
    );
    return res.data as Task[];
  };

  const handleSocketMessage = (e: MessageEvent<any>) => {
    const message = JSON.parse(e.data) as Message;
    if (
      message.type === MessageType.HelloClient ||
      message.type === MessageType.ClientMessage ||
      message.type === MessageType.WorkerConnected ||
      message.type === MessageType.WorkerOffline ||
      message.type === MessageType.ClientLeft
    )
      return;

    if (message.type === MessageType.TaskInProcess) {
      removeTodoTask(message.payload.task!);
      appendInProcessTask(message.payload.task!);
    }
    if (message.type === MessageType.TaskCompleted) {
      removeInProcessTask(message.payload.task!);
      appendCompleteTask(message.payload.task!);
    }
    if (message.type === MessageType.TaskFailed) {
      removeInProcessTask(message.payload.task!);
      appendFailTask(message.payload.task!);
    }
  };

  useEffect(() => {
    socket.addEventListener("message", handleSocketMessage);

    return () => {
      socket.removeEventListener("message", handleSocketMessage);
    };
  }, []);

  useEffect(() => {
    // fetch tasks
    fetchTasks(TaskStatus.NotTaken).then((tasks) => setTodoTasks(tasks));
    fetchTasks(TaskStatus.InProcess).then((tasks) => setInProcessTasks(tasks));
    fetchTasks(TaskStatus.Complete).then((tasks) => setCompleteTasks(tasks));
    fetchTasks(TaskStatus.Fail).then((tasks) => setFailTasks(tasks));
  }, []);

  return (
    <>
      <Card className="w-32 h-32">
        <CardContent className="flex flex-col justify-center items-center h-full p-0">
          <Circle className="mx-auto w-10 h-10"></Circle>
          <div className="text-sm font-light">{TaskStatus.NotTaken}</div>
          <div className="text-xl font-bold">{todoTasks.length}</div>
        </CardContent>
      </Card>

      <Card className="w-32 h-32">
        <CardContent className="flex flex-col justify-center items-center h-full p-0">
          <CircleDashed
            className={cn("mx-auto w-10 h-10", {
              "animate-spin-slow": inProcessTasks.length > 0,
            })}
          ></CircleDashed>
          <div className="text-sm font-light">{TaskStatus.InProcess}</div>
          <div className="text-xl font-bold">{inProcessTasks.length}</div>
        </CardContent>
      </Card>
      <Card className="w-32 h-32">
        <CardContent className="flex flex-col justify-center items-center h-full p-0">
          <CheckCircleIcon className="mx-auto w-10 h-10"></CheckCircleIcon>
          <div className="text-sm font-light">{TaskStatus.Complete}</div>
          <div className="text-xl font-bold">{completeTasks.length}</div>
        </CardContent>
      </Card>
      <Card className="w-32 h-32">
        <CardContent className="flex flex-col justify-center items-center h-full p-0">
          <CircleSlash2 className="mx-auto w-10 h-10"></CircleSlash2>
          <div className="text-sm font-light">{TaskStatus.Fail}</div>
          <div className="text-xl font-bold">{failTasks.length}</div>
        </CardContent>
      </Card>
    </>
  );
}

export default TasksCount;
