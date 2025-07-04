export interface ChatSession {
  id: string;
  visitor_name: string | null;
  visitor_email: string | null;
  visitor_phone: string | null;
  status: string;
  rating: number | null;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  message: string;
  sender_type: string;
  sender_name: string | null;
  created_at: string;
  is_read: boolean;
}