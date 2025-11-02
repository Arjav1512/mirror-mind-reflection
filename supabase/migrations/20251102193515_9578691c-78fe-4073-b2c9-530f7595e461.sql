-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create journal_entries table
CREATE TABLE public.journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own entries"
  ON public.journal_entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own entries"
  ON public.journal_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own entries"
  ON public.journal_entries FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own entries"
  ON public.journal_entries FOR DELETE
  USING (auth.uid() = user_id);

-- Create emotional_analysis table
CREATE TABLE public.emotional_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id UUID NOT NULL REFERENCES public.journal_entries(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  sentiment_score DECIMAL(3,2) NOT NULL, -- -1.00 to 1.00
  emotional_valence TEXT NOT NULL, -- positive, negative, neutral, mixed
  dominant_emotion TEXT, -- joy, sadness, anger, fear, etc.
  confidence_score DECIMAL(3,2), -- 0.00 to 1.00
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.emotional_analysis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own analysis"
  ON public.emotional_analysis FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own analysis"
  ON public.emotional_analysis FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create cognitive_biases table
CREATE TABLE public.cognitive_biases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id UUID NOT NULL REFERENCES public.journal_entries(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  bias_type TEXT NOT NULL, -- catastrophizing, black_white_thinking, emotional_reasoning, fortune_telling, overgeneralization
  excerpt TEXT NOT NULL, -- the specific text showing the bias
  explanation TEXT NOT NULL,
  confidence_score DECIMAL(3,2), -- 0.00 to 1.00
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.cognitive_biases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own biases"
  ON public.cognitive_biases FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own biases"
  ON public.cognitive_biases FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create weekly_summaries table
CREATE TABLE public.weekly_summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  week_start DATE NOT NULL,
  week_end DATE NOT NULL,
  summary TEXT NOT NULL,
  dominant_emotions TEXT[],
  recurring_themes TEXT[],
  behavioral_patterns TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, week_start)
);

ALTER TABLE public.weekly_summaries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own summaries"
  ON public.weekly_summaries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own summaries"
  ON public.weekly_summaries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_journal_entries_user_created ON public.journal_entries(user_id, created_at DESC);
CREATE INDEX idx_emotional_analysis_user_created ON public.emotional_analysis(user_id, created_at DESC);
CREATE INDEX idx_cognitive_biases_user_created ON public.cognitive_biases(user_id, created_at DESC);
CREATE INDEX idx_weekly_summaries_user_week ON public.weekly_summaries(user_id, week_start DESC);

-- Trigger for updated_at on journal_entries
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_journal_entries_updated_at
  BEFORE UPDATE ON public.journal_entries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();