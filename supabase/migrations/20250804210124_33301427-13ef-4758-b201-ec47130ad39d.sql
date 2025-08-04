-- Fix critical security vulnerability: prevent users from updating their own role
-- Only allow owners to update user roles through controlled functions

-- Drop the existing policy that allows users to update their own profile (including role)
DROP POLICY IF EXISTS "Users can update their own profile data" ON public.profiles;

-- Create a new policy that allows users to update their profile BUT NOT their role
CREATE POLICY "Users can update their own profile (except role)" 
ON public.profiles 
FOR UPDATE 
USING (id = auth.uid())
WITH CHECK (
  id = auth.uid() AND 
  -- Prevent role changes by ensuring new role equals current role
  role = (SELECT role FROM public.profiles WHERE id = auth.uid())
);

-- Create a separate policy for owners to update any profile including roles
CREATE POLICY "Owners can update any profile including roles" 
ON public.profiles 
FOR UPDATE 
USING (has_role(auth.uid(), 'owner'::app_role))
WITH CHECK (has_role(auth.uid(), 'owner'::app_role));

-- Restrict some overly permissive public access policies
-- Update game players to require authentication for viewing
DROP POLICY IF EXISTS "Anyone can view game players" ON public.game_players;
CREATE POLICY "Authenticated users can view game players" 
ON public.game_players 
FOR SELECT 
TO authenticated
USING (true);

-- Update leaderboards to require authentication for viewing
DROP POLICY IF EXISTS "Anyone can view leaderboards" ON public.leaderboards;
CREATE POLICY "Authenticated users can view leaderboards" 
ON public.leaderboards 
FOR SELECT 
TO authenticated
USING (true);

-- Update zone champions to require authentication for viewing
DROP POLICY IF EXISTS "Anyone can view zone champions" ON public.zone_champions;
CREATE POLICY "Authenticated users can view zone champions" 
ON public.zone_champions 
FOR SELECT 
TO authenticated
USING (true);

-- Update championship defeats to require authentication for viewing
DROP POLICY IF EXISTS "Anyone can view championship defeats" ON public.championship_defeats;
CREATE POLICY "Authenticated users can view championship defeats" 
ON public.championship_defeats 
FOR SELECT 
TO authenticated
USING (true);

-- Update category performance to require authentication for viewing
DROP POLICY IF EXISTS "Anyone can view category performance" ON public.category_performance;
CREATE POLICY "Authenticated users can view category performance" 
ON public.category_performance 
FOR SELECT 
TO authenticated
USING (true);