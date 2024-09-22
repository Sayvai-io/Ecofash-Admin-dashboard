// src/utils/auth.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://muizndhkpdgmcvyctfim.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11aXpuZGhrcGRnbWN2eWN0ZmltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjE2MzU2NDQsImV4cCI6MjAzNzIxMTY0NH0.EqKsWHm3sAXV6jeMmcBiswc0Hd91vHPjv-_lhNRbev8";
const supabase = createClient(supabaseUrl, supabaseKey);
