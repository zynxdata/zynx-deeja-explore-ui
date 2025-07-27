-- Step 1: Create user roles enum and table
CREATE TYPE public.app_role AS ENUM ('owner', 'admin', 'user');

-- Step 2: Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Step 3: Add role column to profiles table
ALTER TABLE public.profiles ADD COLUMN role app_role DEFAULT 'user';

-- Step 4: Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    WHERE ur.user_id = _user_id
      AND ur.role = _role
  ) OR EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.id = _user_id
      AND p.role = _role
  );
$$;

-- Step 5: Create function to get current user role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS app_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT role FROM public.profiles WHERE id = auth.uid()),
    'user'::app_role
  );
$$;

-- Step 6: Create function to check if user is admin or owner
CREATE OR REPLACE FUNCTION public.is_admin_or_owner()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'owner');
$$;

-- Step 7: Fix existing database functions with proper search_path
CREATE OR REPLACE FUNCTION public.cleanup_old_rate_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.rate_limits 
  WHERE created_at < NOW() - INTERVAL '24 hours';
END;
$$;

CREATE OR REPLACE FUNCTION public.get_security_summary(time_window interval DEFAULT '01:00:00'::interval)
RETURNS TABLE(event_type text, severity text, count bigint, latest_event timestamp with time zone)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sl.event_type,
    sl.severity,
    COUNT(*) as count,
    MAX(sl.created_at) as latest_event
  FROM public.security_logs sl
  WHERE sl.created_at >= NOW() - time_window
  GROUP BY sl.event_type, sl.severity
  ORDER BY count DESC;
END;
$$;

-- Step 8: Update RLS policies for rate_limits (restrict to service role and admins)
DROP POLICY IF EXISTS "Service role can manage rate limits" ON public.rate_limits;

CREATE POLICY "Service role can manage rate limits"
ON public.rate_limits
FOR ALL
TO service_role
USING (true);

CREATE POLICY "Admins can view rate limits"
ON public.rate_limits
FOR SELECT
TO authenticated
USING (public.is_admin_or_owner());

-- Step 9: Update RLS policies for security_logs (restrict to service role and admins)
DROP POLICY IF EXISTS "Service role can manage security logs" ON public.security_logs;

CREATE POLICY "Service role can manage security logs"
ON public.security_logs
FOR ALL
TO service_role
USING (true);

CREATE POLICY "Admins can view security logs"
ON public.security_logs
FOR SELECT
TO authenticated
USING (public.is_admin_or_owner());

-- Step 10: Create RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.is_admin_or_owner());

CREATE POLICY "Owners can manage all roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'owner'));

-- Step 11: Update profiles policies to include role management
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (public.is_admin_or_owner() OR id = auth.uid());

-- Create a simpler role update policy without OLD reference
CREATE POLICY "Users can update their own profile data"
ON public.profiles
FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

CREATE POLICY "Owners can update any profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'owner'))
WITH CHECK (public.has_role(auth.uid(), 'owner'));

-- Step 12: Create function to safely create admin user
CREATE OR REPLACE FUNCTION public.create_admin_user(
  user_email TEXT,
  user_role app_role DEFAULT 'admin'
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_user_id UUID;
BEGIN
  -- Only owners can create admin users
  IF NOT public.has_role(auth.uid(), 'owner') THEN
    RAISE EXCEPTION 'Only owners can create admin users';
  END IF;

  -- Find user by email
  SELECT id INTO target_user_id
  FROM public.profiles
  WHERE email = user_email;

  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'User with email % not found', user_email;
  END IF;

  -- Update user role
  UPDATE public.profiles
  SET role = user_role
  WHERE id = target_user_id;

  -- Insert into user_roles table
  INSERT INTO public.user_roles (user_id, role)
  VALUES (target_user_id, user_role)
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN true;
END;
$$;