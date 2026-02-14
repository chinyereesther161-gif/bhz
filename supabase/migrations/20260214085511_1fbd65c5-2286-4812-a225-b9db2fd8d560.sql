
-- Table to store the admin's wallet address pool (10 per network)
CREATE TABLE public.wallet_pool (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  network TEXT NOT NULL,
  address TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(network, address)
);

-- Table to assign specific wallets to users (1 per network per user)
CREATE TABLE public.user_wallets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  network TEXT NOT NULL,
  wallet_address TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, network)
);

-- RLS for wallet_pool (admin manages, users can read)
ALTER TABLE public.wallet_pool ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view wallet pool"
  ON public.wallet_pool FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage wallet pool"
  ON public.wallet_pool FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS for user_wallets (users see own, admins see all)
ALTER TABLE public.user_wallets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own wallets"
  ON public.user_wallets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all user wallets"
  ON public.user_wallets FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "System can insert user wallets"
  ON public.user_wallets FOR INSERT
  WITH CHECK (true);

-- Function to assign random wallets from the pool to a new user
CREATE OR REPLACE FUNCTION public.assign_wallets_to_user()
  RETURNS trigger
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO 'public'
AS $$
DECLARE
  net TEXT;
  wallet_addr TEXT;
BEGIN
  FOR net IN SELECT DISTINCT network FROM wallet_pool
  LOOP
    SELECT address INTO wallet_addr
    FROM wallet_pool
    WHERE network = net
    ORDER BY random()
    LIMIT 1;
    
    IF wallet_addr IS NOT NULL THEN
      INSERT INTO user_wallets (user_id, network, wallet_address)
      VALUES (NEW.id, net, wallet_addr);
    END IF;
  END LOOP;
  
  RETURN NEW;
END;
$$;

-- Trigger: assign wallets when a new auth user is created
CREATE TRIGGER on_auth_user_created_assign_wallets
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.assign_wallets_to_user();
