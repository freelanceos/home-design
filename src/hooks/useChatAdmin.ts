import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ChatSession, Message } from "@/types/chat";

export const useChatAdmin = (adminName: string) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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

  const loadMessages = async (sessionId: string) => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
      
      await supabase
        .from('chat_messages')
        .update({ is_read: true })
        .eq('session_id', sessionId)
        .eq('sender_type', 'visitor');

    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

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

  const handleSessionSelect = (session: ChatSession) => {
    setSelectedSession(session);
    loadMessages(session.id);
  };

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

  return {
    sessions,
    selectedSession,
    messages,
    newMessage,
    isLoading,
    setNewMessage,
    sendMessage,
    closeSession,
    handleSessionSelect
  };
};