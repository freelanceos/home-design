import { ScrollArea } from "@/components/ui/scroll-area";
import { Message } from "@/types/chat";

interface ChatMessagesProps {
  messages: Message[];
}

export const ChatMessages = ({ messages }: ChatMessagesProps) => {
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('ar-SA');
  };

  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender_type === 'admin' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.sender_type === 'admin'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium">
                  {message.sender_name}
                </span>
                <span className="text-xs opacity-70">
                  {formatTime(message.created_at)}
                </span>
              </div>
              <p className="text-sm">{message.message}</p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};