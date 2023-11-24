import { Message, MessageType, useStore } from "@/store";
import { useEffect } from "react";
import WorkerCard from "./WorkerCard";

export default function Workers() {
  const { socket, workerMessage, updateWorkerMessage } = useStore();
  const handleSocketMessage = (e: MessageEvent<any>) => {
    const message = JSON.parse(e.data) as Message;
    if (
      message.type !== MessageType.HelloClient &&
      message.type !== MessageType.ClientMessage &&
      message.type !== MessageType.ClientLeft
    ) {
      updateWorkerMessage(message);
    }
  };

  useEffect(() => {
    socket.addEventListener("message", handleSocketMessage);

    return () => {
      socket.removeEventListener("message", handleSocketMessage);
    };
  }, []);

  // const fetchWorkers = async () => {
  //   const res = await axios.get("http://localhost:3030/workers");
  //   return res.data as Worker[];
  // };
  // const { isLoading, isError, data, error } = useQuery<Worker[], Error>(
  //   "movies",
  //   fetchWorkers
  // );
  // if (isLoading) {
  //   return <span>loading</span>;
  // }

  // if (isError) {
  //   return <span>err message: {error?.message}</span>;
  // }

  // useEffect(() => {
  //   setWorkers([...Array(4)].map((_, i) => ({ name: `worker${i}` })));
  // }, []);
  return (
    <>
      {workerMessage.map((message) => (
        <WorkerCard
          key={message.payload.worker!.id}
          name={message.payload.worker!.name}
          message={message}
        ></WorkerCard>
      ))}
    </>
  );
}
