-- The existing policy has a trailing space in its name, so we need to drop the correct one
-- First, drop the existing policies with trailing spaces and recreate them properly

-- Fix journal_entries UPDATE policy - drop both variations to be safe
DROP POLICY IF EXISTS "Users can update own entries" ON public.journal_entries;
DROP POLICY IF EXISTS "Users can update own entries " ON public.journal_entries;
CREATE POLICY "Users can update own entries" 
ON public.journal_entries 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Fix journal_entries DELETE policy
DROP POLICY IF EXISTS "Users can delete own entries" ON public.journal_entries;
DROP POLICY IF EXISTS "Users can delete own entries " ON public.journal_entries;
CREATE POLICY "Users can delete own entries" 
ON public.journal_entries 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add UPDATE policy for emotional_analysis (for data correction)
DROP POLICY IF EXISTS "Users can update own analysis" ON public.emotional_analysis;
CREATE POLICY "Users can update own analysis" 
ON public.emotional_analysis 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Add DELETE policy for emotional_analysis (for data management)
DROP POLICY IF EXISTS "Users can delete own analysis" ON public.emotional_analysis;
CREATE POLICY "Users can delete own analysis" 
ON public.emotional_analysis 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add UPDATE policy for cognitive_biases (for correction)
DROP POLICY IF EXISTS "Users can update own biases" ON public.cognitive_biases;
CREATE POLICY "Users can update own biases" 
ON public.cognitive_biases 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Add DELETE policy for cognitive_biases (for data management)
DROP POLICY IF EXISTS "Users can delete own biases" ON public.cognitive_biases;
CREATE POLICY "Users can delete own biases" 
ON public.cognitive_biases 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add UPDATE policy for weekly_summaries (for correction)
DROP POLICY IF EXISTS "Users can update own summaries" ON public.weekly_summaries;
CREATE POLICY "Users can update own summaries" 
ON public.weekly_summaries 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Add DELETE policy for weekly_summaries (for data management)
DROP POLICY IF EXISTS "Users can delete own summaries" ON public.weekly_summaries;
CREATE POLICY "Users can delete own summaries" 
ON public.weekly_summaries 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add DELETE policy for profiles (GDPR compliance - right to be forgotten)
DROP POLICY IF EXISTS "Users can delete own profile" ON public.profiles;
CREATE POLICY "Users can delete own profile" 
ON public.profiles 
FOR DELETE 
USING (auth.uid() = id);