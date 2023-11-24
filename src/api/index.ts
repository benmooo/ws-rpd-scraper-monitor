import { Task, TaskStatus } from "@/store";
import axios from "axios";

export const fetchTasks = async (category: TaskStatus) => {
  const res = await axios.get(
    `http://localhost:3000/tasks?category=${category}`
  );
  return res.data as Task[];
};
