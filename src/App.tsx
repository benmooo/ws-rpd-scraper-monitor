import { useEffect } from "react";
import { useStore } from "./store";
import { ModeToggle } from "./components/ModeToggle";
import ChatBox from "./components/ChatBox";

function App() {
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
    <div className="relative flex min-h-screen flex-col">
      <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="ml-auto">
            <ModeToggle></ModeToggle>
          </div>
        </div>
      </div>

      {/* <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10"> */}
      <div className="container flex-1 items-start">
        {/* <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
          <div className="p-4 text-center"> this is the side bar</div>
        </aside> */}
        <main className="p-2 grow flex-1">
          <div className="grid grid-cols-3 gap-2">
            <div>
              <ChatBox></ChatBox>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
