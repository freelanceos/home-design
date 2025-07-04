import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Send, User, MessageSquare, Clock, Star, LogOut } from "lucide-react";

interface ChatSession {
  id: string;
  visitor_name: string | null;
  visitor_email: string | null;
  visitor_phone: string | null;
  status: string;
  rating: number | null;
  created_at: string;
  updated_at: string;
}

interface Message {
  id: string;
  message: string;
  sender_type: string;
  sender_name: string | null;
  created_at: string;
  is_read: boolean;
}

const ChatAdmin = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [adminName, setAdminName] = useState("فريق الدعم");
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // فحص حالة تسجيل الدخول
  useEffect(() => {
    const checkAdminAuth = () => {
      const adminSession = localStorage.getItem('admin_session');
      if (!adminSession) {
        navigate('/admin-login');
        return;
      }

      try {
        const session = JSON.parse(adminSession);
        const loginTime = new Date(session.loginTime);
        const now = new Date();
        const hoursDiff = (now.getTime() - loginTime.getTime()) / (1000 * 60 * 60);

        // انتهاء صلاحية الجلسة بعد 24 ساعة
        if (hoursDiff > 24) {
          localStorage.removeItem('admin_session');
          navigate('/admin-login');
          return;
        }

        setIsAuthenticated(true);
        setAdminName(session.email || "فريق الدعم");
      } catch (error) {
        console.error('Error parsing admin session:', error);
        localStorage.removeItem('admin_session');
        navigate('/admin-login');
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAdminAuth();
  }, [navigate]);

  // تسجيل الخروج
  const handleLogout = () => {
    localStorage.removeItem('admin_session');
    toast({
      title: "تم تسجيل الخروج",
      description: "تم تسجيل الخروج بنجاح",
    });
    navigate('/admin-login');
  };

  // عدم عرض المحتوى إذا لم يتم التحقق من الهوية
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

  // تحميل جلسات الشات
  const loadSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setSessions(data || []);
    } catch (error) {
      console.error('Error loading sessions:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في تحميل جلسات الشات",
        variant: "destructive",
      });
    }
  };

  // تحميل رسائل الجلسة المحددة
  const loadMessages = async (sessionId: string) => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
      
      // تحديد الرسائل كمقروءة
      await supabase
        .from('chat_messages')
        .update({ is_read: true })
        .eq('session_id', sessionId)
        .eq('sender_type', 'visitor');

    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  // إرسال رد من الدعم الفني
  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedSession) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          session_id: selectedSession.id,
          message: newMessage,
          sender_type: 'admin',
          sender_name: adminName
        });

      if (error) throw error;

      setNewMessage("");
      await loadMessages(selectedSession.id);

      // تحديث حالة الجلسة
      await supabase
        .from('chat_sessions')
        .update({ 
          status: 'active',
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedSession.id);

      await loadSessions();

      toast({
        title: "تم الإرسال",
        description: "تم إرسال ردك بنجاح",
      });

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في إرسال الرسالة",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // إغلاق الجلسة
  const closeSession = async (sessionId: string) => {
    try {
      await supabase
        .from('chat_sessions')
        .update({ 
          status: 'closed',
          closed_at: new Date().toISOString()
        })
        .eq('id', sessionId);

      await loadSessions();
      if (selectedSession?.id === sessionId) {
        setSelectedSession(null);
        setMessages([]);
      }

      toast({
        title: "تم إغلاق الجلسة",
        description: "تم إغلاق جلسة الشات بنجاح",
      });

    } catch (error) {
      console.error('Error closing session:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في إغلاق الجلسة",
        variant: "destructive",
      });
    }
  };

  // الاستماع للرسائل الجديدة
  useEffect(() => {
    const channel = supabase
      .channel('admin-chat-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages'
        },
        () => {
          loadSessions();
          if (selectedSession) {
            loadMessages(selectedSession.id);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_sessions'
        },
        () => {
          loadSessions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedSession]);

  useEffect(() => {
    loadSessions();
  }, []);

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('ar-SA');
  };

  const getUnreadCount = (sessionId: string) => {
    // هذا مبسط - في التطبيق الحقيقي يمكن تحسينه
    return 0;
  };

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
          {/* قائمة الجلسات */}
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
                  onChange={(e) => setAdminName(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[500px]">
                <div className="space-y-2 p-4">
                  {sessions.map((session) => (
                    <div
                      key={session.id}
                      onClick={() => {
                        setSelectedSession(session);
                        loadMessages(session.id);
                      }}
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

          {/* منطقة المحادثة */}
          <Card className="lg:col-span-2">
            {selectedSession ? (
              <>
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
                          onClick={() => closeSession(selectedSession.id)}
                        >
                          إغلاق الجلسة
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="flex flex-col h-[400px] p-0">
                  {/* منطقة الرسائل */}
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

                  {/* منطقة الرد */}
                  {selectedSession.status === 'active' && (
                    <div className="p-4 border-t">
                      <div className="space-y-2">
                        <Textarea
                          placeholder="اكتب ردك هنا..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              sendMessage();
                            }
                          }}
                          className="min-h-[60px]"
                        />
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">
                            اضغط Enter للإرسال، Shift+Enter لسطر جديد
                          </span>
                          <Button
                            onClick={sendMessage}
                            disabled={isLoading || !newMessage.trim()}
                            size="sm"
                          >
                            <Send className="h-4 w-4 ml-2" />
                            إرسال
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </>
            ) : (
              <CardContent className="flex items-center justify-center h-full">
                <div className="text-center text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>اختر جلسة شات للبدء في المحادثة</p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChatAdmin;