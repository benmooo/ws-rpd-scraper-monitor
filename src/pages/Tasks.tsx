import { Separator } from "@/components/ui/separator"

function Tasks() {
  return (
<div className="hidden space-y-6 p-10 pb-16 md:block">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Tasks</h2>
        <p className="text-muted-foreground">
            All tasks
        </p>
      </div>
      <Separator className="my-6" />
      
    </div>
  )
}

export default Tasks