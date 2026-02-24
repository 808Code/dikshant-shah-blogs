import { createClient } from "@supabase/supabase-js";

export const SUPABASE_URL = "https://znhbwisezdyoqxvkaslo.supabase.co";
const supabaseAnonKey = "sb_publishable_kaC1qSAW4z4_n-b72-Kk9w_MtfHT5tI";

export const supabase = createClient(SUPABASE_URL, supabaseAnonKey);
