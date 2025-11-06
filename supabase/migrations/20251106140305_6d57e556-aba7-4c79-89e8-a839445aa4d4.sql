-- Add location column to journal_entries table
ALTER TABLE public.journal_entries 
ADD COLUMN location text;

-- Add index for faster queries on created_at for past entries
CREATE INDEX idx_journal_entries_created_at ON public.journal_entries(created_at DESC);