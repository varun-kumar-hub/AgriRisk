export const serverEnv = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  openAiApiKey: process.env.OPENAI_API_KEY ?? "",
  weatherApiKey: process.env.WEATHER_API_KEY ?? "",
  marketDataApiKey: process.env.MARKET_DATA_API_KEY ?? "",
  satelliteDataApiKey: process.env.SATELLITE_DATA_API_KEY ?? ""
};
