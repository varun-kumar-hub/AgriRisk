-- Supabase Migration: 004_settings_and_preferences.sql
-- Extend profiles table and create notification_preferences table for user account settings.

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'Farmer',
  ADD COLUMN IF NOT EXISTS avatar_url TEXT,
  ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'India',
  ADD COLUMN IF NOT EXISTS state TEXT DEFAULT 'Chhattisgarh',
  ADD COLUMN IF NOT EXISTS district TEXT DEFAULT 'Durg',
  ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'Asia/Kolkata',
  ADD COLUMN IF NOT EXISTS units TEXT DEFAULT 'Metric',
  ADD COLUMN IF NOT EXISTS temperature_unit TEXT DEFAULT '°C',
  ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'INR ₹',
  ADD COLUMN IF NOT EXISTS default_farm_id TEXT DEFAULT 'custom-farm-1',
  ADD COLUMN IF NOT EXISTS default_crop_id TEXT DEFAULT 'rice',
  ADD COLUMN IF NOT EXISTS default_season TEXT DEFAULT 'Kharif',
  ADD COLUMN IF NOT EXISTS ai_response_style TEXT DEFAULT 'Farmer Friendly',
  ADD COLUMN IF NOT EXISTS ai_response_language TEXT DEFAULT 'app',
  ADD COLUMN IF NOT EXISTS ai_use_farm_context BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS show_ai_explanations BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS show_confidence_scores BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS show_risk_factors BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS show_supporting_data BOOLEAN DEFAULT TRUE;

CREATE TABLE IF NOT EXISTS public.notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  crop_risk BOOLEAN DEFAULT TRUE,
  weather BOOLEAN DEFAULT TRUE,
  pest_disease BOOLEAN DEFAULT TRUE,
  market BOOLEAN DEFAULT TRUE,
  irrigation BOOLEAN DEFAULT TRUE,
  ai_recommendations BOOLEAN DEFAULT TRUE,
  crop_health BOOLEAN DEFAULT TRUE,
  regional_risk BOOLEAN DEFAULT TRUE,
  critical BOOLEAN DEFAULT TRUE,
  high BOOLEAN DEFAULT TRUE,
  moderate BOOLEAN DEFAULT FALSE,
  low BOOLEAN DEFAULT FALSE,
  in_app BOOLEAN DEFAULT TRUE,
  email BOOLEAN DEFAULT TRUE,
  push BOOLEAN DEFAULT FALSE,
  quiet_hours_enabled BOOLEAN DEFAULT FALSE,
  quiet_hours_start TEXT DEFAULT '22:00',
  quiet_hours_end TEXT DEFAULT '06:00',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for notification_preferences
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notification preferences"
  ON public.notification_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notification preferences"
  ON public.notification_preferences FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notification preferences"
  ON public.notification_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);
