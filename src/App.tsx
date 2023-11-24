import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import CreateWorker from "@/pages/CreateWorker";
import Tasks from "./pages/Tasks";
// ... import other pages

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-worker" element={<CreateWorker />} />
        <Route path="/tasks" element={<Tasks />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
