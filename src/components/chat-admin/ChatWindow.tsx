import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, MessageSquare } from "lucide-react";
import { ChatSession, Message } from "@/types/chat";
import { ChatMessages } from "./ChatMessages";
import { MessageInput } from "./MessageInput";

interface ChatWindowProps {
  selectedSession: ChatSession | null;
  messages: Message[];
  newMessage: string;
  isLoading: boolean;
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
  onCloseSession: (sessionId: string) => void;
}

export const ChatWindow = ({
  selectedSession,
  messages,
  newMessage,
  isLoading,
  onMessageChange,
  onSendMessage,
  onCloseSession
}: ChatWindowProps) => {
  if (!selectedSession) {
    return (
      <Card className="lg:col-span-2">
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>اختر جلسة شات للبدء في المحادثة</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="lg:col-span-2">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {selectedSession.visitor_name || 'زائر مجهول'}
            </CardTitle>
            <div className="text-sm text-muted-foreground mt-1">
              {selectedSession.visitor_email && (
                <p>البريد الإلكتروني: {selectedSession.visitor_email}</p>
              )}
              {selectedSession.visitor_phone && (
                <p>الهاتف: {selectedSession.visitor_phone}</p>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Badge 
              variant={selectedSession.status === 'active' ? 'default' : 'secondary'}
            >
              {selectedSession.status === 'active' ? 'نشط' : 'مغلق'}
            </Badge>
            {selectedSession.status === 'active' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onCloseSession(selectedSession.id)}
              >
                إغلاق الجلسة
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col h-[400px] p-0">
        <ChatMessages messages={messages} />
        
        {selectedSession.status === 'active' && (
          <MessageInput
            newMessage={newMessage}
            isLoading={isLoading}
            onMessageChange={onMessageChange}
            onSendMessage={onSendMessage}
          />
        )}
      </CardContent>
    </Card>
  );
};