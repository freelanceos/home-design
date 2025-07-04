-- إنشاء جدول بيانات الشات
CREATE TABLE public.chatdata (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  visitor_name TEXT NOT NULL,
  visitor_phone TEXT NOT NULL,
  chat_start_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  chat_end_time TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- تفعيل Row Level Security
ALTER TABLE public.chatdata ENABLE ROW LEVEL SECURITY;

-- إنشاء سياسات الأمان
CREATE POLICY "Anyone can create chatdata entries" 
ON public.chatdata 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can view chatdata entries" 
ON public.chatdata 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can update chatdata entries" 
ON public.chatdata 
FOR UPDATE 
USING (true);

-- إنشاء trigger لتحديث updated_at تلقائياً
CREATE TRIGGER update_chatdata_updated_at
BEFORE UPDATE ON public.chatdata
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();