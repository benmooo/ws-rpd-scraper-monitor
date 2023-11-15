import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Message, MessageType, Task, useStore } from "@/store";

type Props = {
  name: string;
  message?: Message;
};
export default function WorkerCard({ name, message }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{message?.payload.task?.id}</CardDescription>
      </CardHeader>
      <CardContent>
        <div>status: {message?.type}</div>
        <div>task: {message?.payload.task?.value}</div>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}
