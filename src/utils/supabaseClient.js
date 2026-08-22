import { createClient } from "@supabase/supabase-js";

// Read from Environment variables or Local Storage configuration
export function getSupabaseCredentials() {
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  let localUrl = "";
  let localKey = "";
  if (typeof window !== "undefined") {
    localUrl = localStorage.getItem("portfolio_supabase_url") || "";
    localKey = localStorage.getItem("portfolio_supabase_key") || "";
  }

  const url = (envUrl || localUrl || "").trim();
  const key = (envKey || localKey || "").trim();

  return { url, key, isConfigured: Boolean(url && key && url.startsWith("https://")) };
}

let supabaseInstance = null;
let currentUrl = null;
let currentKey = null;

export function getSupabase() {
  const { url, key, isConfigured } = getSupabaseCredentials();

  if (!isConfigured) return null;

  if (!supabaseInstance || currentUrl !== url || currentKey !== key) {
    try {
      supabaseInstance = createClient(url, key, {
        auth: { persistSession: false },
      });
      currentUrl = url;
      currentKey = key;
    } catch (err) {
      console.warn("Failed to initialize Supabase client:", err);
      return null;
    }
  }

  return supabaseInstance;
}

/**
 * Upload an image file to Supabase Storage and return its public URL
 */
export async function uploadImageToSupabase(file, folder = "uploads") {
  const supabase = getSupabase();
  if (!supabase) {
    throw new Error("Supabase is not configured yet. Using local Base64 storage.");
  }

  const fileExt = file.name ? file.name.split(".").pop() : "jpg";
  const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

  // Upload to public 'portfolio-assets' bucket
  const { data, error } = await supabase.storage
    .from("portfolio-assets")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (error) {
    // If bucket doesn't exist or permissions issue, log and throw
    console.error("Supabase storage upload error:", error);
    throw error;
  }

  const { data: publicUrlData } = supabase.storage
    .from("portfolio-assets")
    .getPublicUrl(data.path);

  return publicUrlData?.publicUrl;
}

/**
 * Fetch the latest live portfolio data snapshot from Supabase
 */
export async function fetchCloudPortfolio() {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from("portfolio_data")
      .select("*")
      .eq("id", "main_portfolio")
      .single();

    if (error || !data) {
      return null;
    }

    return data.payload;
  } catch (err) {
    console.warn("Cloud sync fetch failed, using local data:", err);
    return null;
  }
}

/**
 * Save complete portfolio data snapshot to Supabase
 */
export async function saveCloudPortfolio(payload) {
  const supabase = getSupabase();
  if (!supabase) return false;

  try {
    const { error } = await supabase.from("portfolio_data").upsert(
      {
        id: "main_portfolio",
        payload: payload,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );

    if (error) {
      console.warn("Cloud sync upsert notice:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("Could not save to Supabase cloud:", err);
    return false;
  }
}
