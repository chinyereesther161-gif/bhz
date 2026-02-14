
-- Update handle_new_user to give $10 welcome bonus and send welcome notifications
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, email, balance)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.email, ''),
    10
  );
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  -- Welcome notification with $10 bonus
  INSERT INTO public.notifications (user_id, title, message)
  VALUES (
    NEW.id,
    'Welcome to Capvest AI! 🎉',
    'Your account has been created successfully. We''ve added a $10 welcome bonus to your balance. Start your AI trading journey today!'
  );
  
  -- How to invest notification
  INSERT INTO public.notifications (user_id, title, message)
  VALUES (
    NEW.id,
    'How to Start Earning 💰',
    'To start earning weekly returns: 1) Deposit funds via crypto 2) Choose an investment plan 3) Our AI engine trades 24/7 4) Receive weekly payouts every Monday. Visit the Packages page to get started!'
  );
  
  RETURN NEW;
END;
$$;
