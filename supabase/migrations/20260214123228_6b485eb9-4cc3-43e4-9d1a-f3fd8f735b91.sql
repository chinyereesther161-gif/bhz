
-- Fix the function to use user_id instead of id
CREATE OR REPLACE FUNCTION public.assign_wallets_to_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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
      VALUES (NEW.user_id, net, wallet_addr);
    END IF;
  END LOOP;
  
  RETURN NEW;
END;
$function$;
