create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  email text,
  role text default 'farmer',
  location text,
  created_at timestamptz default now()
);

create table if not exists farms (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  name text not null,
  location text,
  area numeric,
  soil_type text,
  soil_ph numeric,
  irrigation_type text,
  water_availability text,
  latitude numeric,
  longitude numeric,
  created_at timestamptz default now()
);

create table if not exists crop_cycles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  farm_id uuid not null references farms(id) on delete cascade,
  crop text not null,
  season text,
  sowing_date date,
  current_stage text,
  created_at timestamptz default now()
);

create table if not exists risk_predictions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  farm_id uuid references farms(id) on delete cascade,
  crop_cycle_id uuid references crop_cycles(id) on delete cascade,
  overall_score integer not null,
  risk_level text not null,
  confidence numeric,
  prediction_date date default current_date,
  created_at timestamptz default now()
);

create table if not exists recommendations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  crop_cycle_id uuid references crop_cycles(id) on delete cascade,
  category text,
  title text not null,
  description text,
  priority text,
  estimated_cost numeric,
  expected_risk_reduction numeric,
  expected_benefit text,
  created_at timestamptz default now()
);

alter table profiles enable row level security;
alter table farms enable row level security;
alter table crop_cycles enable row level security;
alter table risk_predictions enable row level security;
alter table recommendations enable row level security;

create policy "profiles own rows" on profiles for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "farms own rows" on farms for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "crop cycles own rows" on crop_cycles for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "risk predictions own rows" on risk_predictions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "recommendations own rows" on recommendations for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
