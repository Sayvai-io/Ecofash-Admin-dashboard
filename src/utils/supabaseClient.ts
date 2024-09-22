// src/utils/supabaseClient.ts

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://muizndhkpdgmcvyctfim.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;
console.log(supabaseKey);
const supabase = createClient(supabaseUrl, supabaseKey);
export const logout = async () => {
  await supabase.auth.signOut();
  localStorage.removeItem("supabaseSession");
  window.location.href = "/";
};

export default supabase;
