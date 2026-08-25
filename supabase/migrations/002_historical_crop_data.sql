-- Migration for Historical Crop Data table
create table if not exists crop_historical_data (
  id uuid primary key default gen_random_uuid(),
  dist_code integer,
  year integer not null,
  state_code integer,
  state_name text not null,
  dist_name text not null,
  crop text not null,
  area_ha numeric,
  yield_kg_per_ha numeric,
  n_req_kg_per_ha numeric,
  p_req_kg_per_ha numeric,
  k_req_kg_per_ha numeric,
  total_n_kg numeric,
  total_p_kg numeric,
  total_k_kg numeric,
  temperature_c numeric,
  humidity_pct numeric,
  ph numeric,
  rainfall_mm numeric,
  wind_speed_m_s numeric,
  solar_radiation_mj_m2_day numeric,
  created_at timestamptz default now()
);

-- Index for fast queries by location and crop
create index if not exists idx_crop_hist_lookup on crop_historical_data (state_name, dist_name, crop);
create index if not exists idx_crop_hist_crop on crop_historical_data (crop);
create index if not exists idx_crop_hist_year on crop_historical_data (year);

-- Enable RLS
alter table crop_historical_data enable row level security;

-- Public read access policy for historical data
create policy "Allow public read on historical crop data" 
  on crop_historical_data for select 
  using (true);
