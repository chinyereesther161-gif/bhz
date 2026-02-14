
-- Support messages table
CREATE TABLE public.support_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  admin_reply TEXT,
  replied_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own support messages" ON public.support_messages FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create support messages" ON public.support_messages FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all support messages" ON public.support_messages FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update support messages" ON public.support_messages FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));

-- Add tracking columns to profiles
ALTER TABLE public.profiles ADD COLUMN last_ip TEXT;
ALTER TABLE public.profiles ADD COLUMN last_country TEXT;
ALTER TABLE public.profiles ADD COLUMN last_device TEXT;

-- Visitor logs table
CREATE TABLE public.visitor_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  ip_address TEXT,
  country TEXT,
  device TEXT,
  page TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.visitor_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view visitor logs" ON public.visitor_logs FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Anyone can insert visitor logs" ON public.visitor_logs FOR INSERT WITH CHECK (true);
