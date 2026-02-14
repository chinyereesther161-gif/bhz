
-- Add referral, recovery token, and phone columns to profiles
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS referred_by TEXT,
  ADD COLUMN IF NOT EXISTS recovery_token TEXT,
  ADD COLUMN IF NOT EXISTS phone TEXT;

-- Generate referral codes for existing users
UPDATE public.profiles 
SET referral_code = 'CAP-' || UPPER(SUBSTR(MD5(RANDOM()::TEXT || user_id::TEXT), 1, 8)) 
WHERE referral_code IS NULL;

-- Generate recovery tokens for existing users
UPDATE public.profiles 
SET recovery_token = UPPER(SUBSTR(MD5(RANDOM()::TEXT || user_id::TEXT || NOW()::TEXT), 1, 16)) 
WHERE recovery_token IS NULL;

-- Update handle_new_user to include referral_code, recovery_token, phone
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, name, email, balance, referral_code, recovery_token, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.email, ''),
    10,
    'CAP-' || UPPER(SUBSTR(MD5(RANDOM()::TEXT || NEW.id::TEXT), 1, 8)),
    UPPER(SUBSTR(MD5(RANDOM()::TEXT || NEW.id::TEXT || NOW()::TEXT), 1, 16)),
    COALESCE(NEW.raw_user_meta_data->>'phone', '')
  );

  -- Check if referred by someone
  IF NEW.raw_user_meta_data->>'referred_by' IS NOT NULL THEN
    UPDATE public.profiles SET referred_by = NEW.raw_user_meta_data->>'referred_by' WHERE user_id = NEW.id;
  END IF;

  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  
  INSERT INTO public.notifications (user_id, title, message)
  VALUES (
    NEW.id,
    'Welcome to Capvest AI! 🎉',
    'Your account has been created successfully. We''ve added a $10 welcome bonus to your balance. Start your AI trading journey today!'
  );
  
  INSERT INTO public.notifications (user_id, title, message)
  VALUES (
    NEW.id,
    'How to Start Earning 💰',
    'To start earning weekly returns: 1) Deposit funds via crypto 2) Choose an investment plan 3) Our AI engine trades 24/7 4) Receive weekly payouts every Monday. Visit the Packages page to get started!'
  );
  
  RETURN NEW;
END;
$function$;

-- Referral bonus trigger: $5 to referrer on first investment
CREATE OR REPLACE FUNCTION public.process_referral_bonus()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  referrer_code TEXT;
  referrer_user_id UUID;
BEGIN
  IF TG_OP = 'INSERT' THEN
    SELECT p.referred_by INTO referrer_code 
    FROM public.profiles p 
    WHERE p.user_id = NEW.user_id;
    
    IF referrer_code IS NOT NULL THEN
      SELECT p.user_id INTO referrer_user_id
      FROM public.profiles p
      WHERE p.referral_code = referrer_code;
      
      IF referrer_user_id IS NOT NULL THEN
        -- Only first investment triggers bonus
        IF NOT EXISTS (
          SELECT 1 FROM public.investments 
          WHERE user_id = NEW.user_id AND id != NEW.id
        ) THEN
          UPDATE public.profiles SET balance = balance + 5 WHERE user_id = referrer_user_id;
          
          INSERT INTO public.notifications (user_id, title, message)
          VALUES (referrer_user_id, 'Referral Bonus! 🎉', 'Your referral just made their first investment! $5 bonus has been added to your balance.');
        END IF;
      END IF;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Create trigger
DROP TRIGGER IF EXISTS process_referral_bonus_trigger ON public.investments;
CREATE TRIGGER process_referral_bonus_trigger
AFTER INSERT ON public.investments
FOR EACH ROW
EXECUTE FUNCTION public.process_referral_bonus();
