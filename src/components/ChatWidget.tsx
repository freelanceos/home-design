import { useState, useEffect, useRef } from "react";
import { MessageCircle, Send, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  message: string;
  sender_type: string;
  sender_name: string | null;
  created_at: string;
}

interface ChatSession {
  id: string;
  visitor_name: string | null;
  status: string;
}

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [session, setSession] = useState<ChatSession | null>(null);
  const [visitorName, setVisitorName] = useState("");
  const [visitorPhone, setVisitorPhone] = useState("");
  const [showNameInput, setShowNameInput] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // الاستماع للرسائل الجديدة
  useEffect(() => {
    if (!session) return;

    const channel = supabase
      .channel('chat-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `session_id=eq.${session.id}`
        },
        (payload) => {
          const newMsg = payload.new as Message;
          setMessages(prev => [...prev, newMsg]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session]);

  const createSession = async () => {
    if (!visitorName.trim() || !visitorPhone.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال اسمك ورقم هاتفك",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const visitorId = Math.random().toString(36).substring(7);
      
      const { data: sessionData, error: sessionError } = await supabase
        .from('chat_sessions')
        .insert({
          visitor_id: visitorId,
          visitor_name: visitorName,
          visitor_phone: visitorPhone,
          status: 'active'
        })
        .select()
        .single();

      if (sessionError) throw sessionError;

      setSession(sessionData);
      setShowNameInput(false);

      // إرسال رسالة ترحيب
      await supabase
        .from('chat_messages')
        .insert({
          session_id: sessionData.id,
          message: "شكراً لك على رسالتك. سيقوم أحد خبرائنا بالرد عليك قريباً.",
          sender_type: 'admin',
          sender_name: 'فريق الدعم'
        });

    } catch (error) {
      console.error('Error creating session:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في إنشاء جلسة الشات",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !session) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          session_id: session.id,
          message: newMessage,
          sender_type: 'visitor',
          sender_name: visitorName
        });

      if (error) throw error;

      setNewMessage("");

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

  const loadMessages = async () => {
    if (!session) return;

    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', session.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data as Message[] || []);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  useEffect(() => {
    if (session) {
      loadMessages();
    }
  }, [session]);

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('ar-SA', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      {/* زر فتح الشات */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 left-6 z-50 rounded-full h-14 w-14 shadow-lg hover:shadow-xl transition-all duration-300"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {/* نافذة الشات */}
      {isOpen && (
        <Card className="fixed bottom-6 left-6 z-50 w-80 h-96 shadow-xl">
          <CardHeader className="bg-gradient-primary text-primary-foreground p-4 rounded-t-lg">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">تواصل معنا</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-primary-foreground hover:bg-white/20 h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-0 flex flex-col h-80">
            {showNameInput ? (
              <div className="p-4 space-y-4">
                <p className="text-sm text-muted-foreground">
                  مرحباً! يرجى إدخال بياناتك لبدء المحادثة
                </p>
                <Input
                  placeholder="اسمك"
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                />
                <Input
                  placeholder="رقم هاتفك"
                  value={visitorPhone}
                  onChange={(e) => setVisitorPhone(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && createSession()}
                />
                <Button 
                  onClick={createSession} 
                  disabled={isLoading || !visitorName.trim() || !visitorPhone.trim()}
                  className="w-full"
                >
                  بدء المحادثة
                </Button>
              </div>
            ) : (
              <>
                {/* منطقة الرسائل */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-3">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.sender_type === 'visitor' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-lg ${
                            message.sender_type === 'visitor'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <p className="text-sm">{message.message}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {formatTime(message.created_at)}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* منطقة إرسال الرسائل */}
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      placeholder="اكتب رسالتك..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      disabled={isLoading}
                    />
                    <Button
                      onClick={sendMessage}
                      disabled={isLoading || !newMessage.trim()}
                      size="icon"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default ChatWidget;