import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { User, MessageSquare, Clock, Star } from "lucide-react";
import { ChatSession } from "@/types/chat";

interface SessionListProps {
  sessions: ChatSession[];
  selectedSession: ChatSession | null;
  adminName: string;
  onSessionSelect: (session: ChatSession) => void;
  onAdminNameChange: (name: string) => void;
}

export const SessionList = ({
  sessions,
  selectedSession,
  adminName,
  onSessionSelect,
  onAdminNameChange
}: SessionListProps) => {
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('ar-SA');
  };

  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          جلسات الشات ({sessions.length})
        </CardTitle>
        <div className="space-y-2">
          <Input
            placeholder="اسم الدعم الفني"
            value={adminName}
            onChange={(e) => onAdminNameChange(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[500px]">
          <div className="space-y-2 p-4">
            {sessions.map((session) => (
              <div
                key={session.id}
                onClick={() => onSessionSelect(session)}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedSession?.id === session.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card hover:bg-muted'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="font-medium">
                      {session.visitor_name || 'زائر مجهول'}
                    </span>
                  </div>
                  <Badge 
                    variant={session.status === 'active' ? 'default' : 'secondary'}
                  >
                    {session.status === 'active' ? 'نشط' : 'مغلق'}
                  </Badge>
                </div>
                
                <div className="text-sm opacity-70 flex items-center gap-2">
                  <Clock className="h-3 w-3" />
                  {formatTime(session.updated_at)}
                </div>
                
                {session.rating && (
                  <div className="flex items-center gap-1 mt-2">
                    <Star className="h-3 w-3 fill-current" />
                    <span className="text-xs">{session.rating}/5</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};