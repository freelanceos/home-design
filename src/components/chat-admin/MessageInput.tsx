import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

interface MessageInputProps {
  newMessage: string;
  isLoading: boolean;
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
}

export const MessageInput = ({
  newMessage,
  isLoading,
  onMessageChange,
  onSendMessage
}: MessageInputProps) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className="p-4 border-t">
      <div className="space-y-2">
        <Textarea
          placeholder="اكتب ردك هنا..."
          value={newMessage}
          onChange={(e) => onMessageChange(e.target.value)}
          onKeyPress={handleKeyPress}
          className="min-h-[60px]"
        />
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">
            اضغط Enter للإرسال، Shift+Enter لسطر جديد
          </span>
          <Button
            onClick={onSendMessage}
            disabled={isLoading || !newMessage.trim()}
            size="sm"
          >
            <Send className="h-4 w-4 ml-2" />
            إرسال
          </Button>
        </div>
      </div>
    </div>
  );
};