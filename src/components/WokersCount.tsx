import { PersonStanding, PlusCircleIcon } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { useStore } from "@/store";
import { Button } from "./ui/button";
import axios from "axios";
import { useEffect } from "react";
import { Link } from "react-router-dom";

function WokersCount() {
  const { workers, setWorkers } = useStore();

  useEffect(() => {
    axios
      .get("http://localhost:3000/workers")
      .then(({ data: { data, code } }) => {
        if (code == 200) {
          setWorkers(data);
        }
      });
  }, []);

  return (
    <Card className="w-[16.2rem] h-[16.2rem]">
      <CardContent className="flex flex-col justify-center items-center h-full p-6">
        <PersonStanding className="mx-auto w-16 h-16"></PersonStanding>
        <div className="text-sm font-light">Workers</div>
        <div className="text-[3rem] font-bold">{workers.length}</div>
        <Link to={"/create-worker"}>
          <Button className="w-full mt-0">
            <PlusCircleIcon className="mr-2 p-1"></PlusCircleIcon>
            ADD WORKER
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

export default WokersCount;
