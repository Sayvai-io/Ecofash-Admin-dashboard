// src/utils/auth.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://oqautjxakguunvkpasdv.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xYXV0anhha2d1dW52a3Bhc2R2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY5OTA3MTcsImV4cCI6MjA0MjU2NjcxN30.ph1y60t1P9z447xja78jHz8o8qV23XRa7nK3J0Kfp5I";
const supabase = createClient(supabaseUrl, supabaseKey);
