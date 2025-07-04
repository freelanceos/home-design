import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useChatAdmin } from "@/hooks/useChatAdmin";
import { SessionList } from "@/components/chat-admin/SessionList";
import { ChatWindow } from "@/components/chat-admin/ChatWindow";

const ChatAdmin = () => {
  const {
    isAuthenticated,
    isCheckingAuth,
    adminName,
    setAdminName,
    handleLogout
  } = useAdminAuth();

  const {
    sessions,
    selectedSession,
    messages,
    newMessage,
    isLoading,
    setNewMessage,
    sendMessage,
    closeSession,
    handleSessionSelect
  } = useChatAdmin(adminName);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">جاري التحقق من الهوية...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background p-6" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">إدارة الشات</h1>
            <p className="text-muted-foreground">إدارة والرد على رسائل الزوار</p>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            تسجيل الخروج
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          <SessionList
            sessions={sessions}
            selectedSession={selectedSession}
            adminName={adminName}
            onSessionSelect={handleSessionSelect}
            onAdminNameChange={setAdminName}
          />

          <ChatWindow
            selectedSession={selectedSession}
            messages={messages}
            newMessage={newMessage}
            isLoading={isLoading}
            onMessageChange={setNewMessage}
            onSendMessage={sendMessage}
            onCloseSession={closeSession}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatAdmin;