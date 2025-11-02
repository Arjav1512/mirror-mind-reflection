-- Add onboarding fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN age_group text,
ADD COLUMN occupation text,
ADD COLUMN goals text[],
ADD COLUMN onboarding_completed boolean DEFAULT false;

-- Add check constraint for age_group
ALTER TABLE public.profiles
ADD CONSTRAINT valid_age_group CHECK (age_group IN ('18-24', '25-34', '35-44', '45-54', '55-64', '65+'));