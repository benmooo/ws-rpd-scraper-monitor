import { cn } from "@/lib/utils";
import { Message, MessageType, useStore } from "@/store";
import { Avatar, AvatarFallback } from "./ui/avatar";

function MessageBubble({ msg }: { msg: Message }) {
  const { clientId } = useStore();

  if (msg.type === MessageType.HelloClient) {
    return (
      <div className="flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-xs bg-muted mx-auto font-light">
        <div>
          <div className="truncate text-primary/50 text-center">
            {msg.payload.client?.id === clientId
              ? "You"
              : msg.payload.client?.id}
          </div>
          <div className="text-center">joined the room!</div>
        </div>
      </div>
    );
  }

  if (msg.type === MessageType.ClientLeft) {
    return (
      <div className="flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-xs bg-muted mx-auto font-light">
        <div>
          <div className="text-center">goodby!</div>
          <div className="truncate text-primary/50">
            {msg.payload.client?.id}
          </div>
        </div>
      </div>
    );
  }

  if (msg.type === MessageType.ClientMessage) {
    return (
      <div
        className={cn(
          "flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
          {
            "bg-muted": msg.payload.client?.id !== clientId,
            "ml-auto bg-primary text-primary-foreground":
              msg.payload.client?.id === clientId,
          }
        )}
      >
        <div className="flex items-center">
          {msg.payload.client?.id !== clientId && (
            <Avatar className="w-6 h-6 mr-3">
              <AvatarFallback className="bg-accent-foreground text-background">
                {msg.payload.client?.id.slice(0,2)}
              </AvatarFallback>
            </Avatar>
          )}
          <span>{msg.payload.client?.message}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-max max-w-[75%] gap-2 rounded-lg px-3 py-2 text-xs items-center border bg-muted mx-auto">
      <div
        className={cn("w-3 h-3 rounded-full bg-accent-foreground", {})}
      ></div>
      <span className="flex-1">{msg.payload.worker?.name}: </span>
      <span>{msg.payload.task?.value}</span>
    </div>
  );
}

export default MessageBubble;
