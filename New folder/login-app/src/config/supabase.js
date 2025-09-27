import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://rcpwmljeaapmzbgvoapn.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjcHdtbGplYWFwbXpiZ3ZvYXBuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMzg0MTQsImV4cCI6MjA3MzkxNDQxNH0.glqHnymDASXGhMeHv1L7HoGG8Tcv29m1sJlcyv5LbIY";
export const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
})