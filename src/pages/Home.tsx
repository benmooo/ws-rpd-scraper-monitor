import { useEffect } from "react";
import { TaskStatus, useStore } from "@/store";
import { ModeToggle } from "@/components/ModeToggle";
import ChatBox from "@/components/ChatBox";
import Workers from "@/components/Workers";
import WorkersCount from "@/components/WokersCount";
import { QueryClient, QueryClientProvider } from "react-query";
import TasksCount from "@/components/TasksCount";
import { Button } from "@/components/ui/button";
import { ListRestartIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import axios from "axios";
import { fetchTasks } from "@/api";
import { countdown } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const queryClient = new QueryClient();

function Home() {
  const {
    theme,
    failTasks,
    inProcessTasks,
    todoTasks,
    completeTasks,
    setTodoTasks,
    setFailTasks,
    workers,
  } = useStore();
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);
  return (
    <QueryClientProvider client={queryClient}>
      <div className="relative flex min-h-screen flex-col">
        <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 items-center">
            <div className="ml-auto">
              <ModeToggle></ModeToggle>
            </div>
          </div>
        </div>

        <div className="container flex-1 items-start">
          <main className="p-2 grow flex-1">
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2 space-y-2">
                <div className="flex gap-2">
                  <WorkersCount></WorkersCount>
                  <div className="flex-none">
                    <div className="grid grid-cols-2 gap-1">
                      <TasksCount></TasksCount>
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col justify-center items-center space-y-4">
                    {/* reload tasks from failed */}
                    <div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button className="w-16 h-16">
                            <ListRestartIcon className="w-16 h-16"></ListRestartIcon>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently reload tasks from failed tasks.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => {
                                axios
                                  .put(
                                    "http://localhost:3000/reload-tasks-from-failed"
                                  )
                                  .then((resp) => {
                                    if (resp.data.code == 200) {
                                      setFailTasks([]);

                                      fetchTasks(TaskStatus.NotTaken).then(
                                        (data) => setTodoTasks(data)
                                      );
                                    }
                                  });
                              }}
                            >
                              Continue
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                    {/* ETA */}
                    <div className="w-full flex flex-col">
                      <Progress
                        value={Number(
                          (
                            (1 -
                              todoTasks.length /
                                (todoTasks.length +
                                  inProcessTasks.length +
                                  completeTasks.length +
                                  failTasks.length)) *
                            100
                          ).toFixed(2)
                        )}
                        className="w-[60%] mx-auto"
                      />
                      <p className="mx-auto">
                        {Number(
                          (
                            (1 -
                              todoTasks.length /
                                (todoTasks.length +
                                  inProcessTasks.length +
                                  completeTasks.length +
                                  failTasks.length)) *
                            100
                          ).toFixed(2)
                        )}{" "}
                        %
                      </p>
                    </div>
                    <div>
                      ETA:{" "}
                      {(workers.length > 0 &&
                        countdown(
                          todoTasks.length /
                            workers
                              .map(
                                (worker) =>
                                  2 /
                                  worker.delaySecondsRange.reduce(
                                    (acc, n) => acc + n
                                  )
                              )
                              .reduce((acc, n) => acc + n)
                        )) ||
                        ""}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2"></div>

                <div className="space-y-2">
                  <Workers></Workers>
                </div>
              </div>
              <div>
                <ChatBox></ChatBox>
              </div>
            </div>
          </main>
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default Home;
