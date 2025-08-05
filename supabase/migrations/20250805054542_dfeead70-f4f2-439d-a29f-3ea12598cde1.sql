-- Create functions for secure API key management

-- Function to upsert user API keys
CREATE OR REPLACE FUNCTION public.upsert_user_api_key(
  p_user_id UUID,
  p_service_name TEXT,
  p_encrypted_key TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_api_keys (user_id, service_name, encrypted_key)
  VALUES (p_user_id, p_service_name, p_encrypted_key)
  ON CONFLICT (user_id, service_name) 
  DO UPDATE SET 
    encrypted_key = p_encrypted_key,
    updated_at = NOW();
END;
$$;

-- Function to get user API key
CREATE OR REPLACE FUNCTION public.get_user_api_key(
  p_user_id UUID,
  p_service_name TEXT
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result TEXT;
BEGIN
  SELECT encrypted_key INTO result
  FROM public.user_api_keys
  WHERE user_id = p_user_id AND service_name = p_service_name;
  
  RETURN result;
END;
$$;

-- Function to delete user API key
CREATE OR REPLACE FUNCTION public.delete_user_api_key(
  p_user_id UUID,
  p_service_name TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.user_api_keys
  WHERE user_id = p_user_id AND service_name = p_service_name;
END;
$$;