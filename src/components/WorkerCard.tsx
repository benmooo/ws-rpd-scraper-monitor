import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Message, MessageType, WorkerStatus, useStore } from "@/store";
import {
  CheckCircleIcon,
  CircleDashed,
  CircleSlash2,
  PauseCircle,
  PlayCircleIcon,
  Trash2Icon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import axios from "axios";

type Props = {
  name: string;
  message: Message;
};
export default function WorkerCard({ name, message }: Props) {
  const [pause, setPause] = useState(false);
  const { removeWorker } = useStore();

  return (
    <Card className={cn("relative")}>
      <CardContent className="p-6">
        <div className="flex items-center relative">
          <span className="absolute flex h-3 w-3">
            <span
              className={cn(
                "absolute inline-flex h-full w-full rounded-full bg-primary opacity-75",
                {
                  "animate-ping":
                    message.payload.worker?.status === WorkerStatus.Working,
                }
              )}
            ></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
          </span>
          <p className="flex relative font-bold uppercase mr-2 w-16 truncate ml-5">
            {name}
          </p>
          {message.type === MessageType.TaskInProcess && (
            <div className="flex items-center">
              <CircleDashed
                className={cn("p-1 text-primary mx-2", {
                  "animate-spin-slow": !pause,
                })}
              ></CircleDashed>
              <p className="font-light">{message.payload.task?.value}</p>
            </div>
          )}
          {message.type === MessageType.TaskCompleted && (
            <div className="flex items-center">
              <CheckCircleIcon className="p-1 text-green-500 mx-2"></CheckCircleIcon>
              <p className="font-light">{message.payload.task?.value}</p>
            </div>
          )}
          {message.type === MessageType.TaskFailed && (
            <div className="flex items-center">
              {/* <p className="text-sm font-light px-2 w-32">
                failed to complish{" "}
              </p> */}
              <CircleSlash2 className="p-1 text-red-500 mx-2"></CircleSlash2>
              <p className="font-light">{message.payload.task?.value}</p>
            </div>
          )}

          <div className="flex ml-auto items-center space-x-3">
            <Button
              size="icon"
              variant="ghost"
              className=""
              onClick={() => {
                axios
                  .delete(
                    `http://localhost:3000/workers/${message.payload.worker?.id}`
                  )
                  .then((res) => {
                    if (res.data.code === 200) {
                      removeWorker(message.payload.worker!);
                    }
                  });
              }}
            >
              <Trash2Icon className="mx-2"></Trash2Icon>
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className=""
              onClick={() => {
                axios
                  .patch(
                    `http://localhost:3000/workers/${message.payload.worker?.id}`,
                    {
                      command: (pause && "Resume") || "Pause",
                    }
                  )
                  .then((res) => {
                    if (res.data.code === 200) {
                      setPause((pause) => !pause);
                    }
                  });
              }}
            >
              {(!pause && (
                <PauseCircle className="text-green-300 mx-2"></PauseCircle>
              )) || (
                <PlayCircleIcon className="text-red-300 mx-2"></PlayCircleIcon>
              )}
            </Button>

            <p
              className={cn("text-xs font-light border rounded-xl px-2 py-1", {
                "text-blue-400 border-blue-400":
                  message.type !== MessageType.WorkerOffline,
                "text-secondary-foreground":
                  message.type === MessageType.WorkerOffline,
              })}
            >
              {message.type === MessageType.WorkerOffline
                ? "offline"
                : "online"}{" "}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
