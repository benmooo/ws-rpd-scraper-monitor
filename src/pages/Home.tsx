import { useEffect } from "react";
import { useStore } from "@/store";
import { ModeToggle } from "@/components/ModeToggle";
import ChatBox from "@/components/ChatBox";
import Workers from "@/components/Workers";
import WorkersCount from "@/components/WokersCount";
import { QueryClient, QueryClientProvider } from "react-query";
import TasksCount from "@/components/TasksCount";

const queryClient = new QueryClient();

function Home() {
  const { theme } = useStore();
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