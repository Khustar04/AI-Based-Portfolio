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
export async function fetchCloudPortfolio(customClient = null) {
  const supabase = customClient || getSupabase();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from("portfolio_data")
      .select("*")
      .eq("id", "main_portfolio")
      .maybeSingle();

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
export async function saveCloudPortfolio(payload, customClient = null) {
  const supabase = customClient || getSupabase();
  if (!supabase) return { success: false, message: "Supabase not connected" };

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
      console.warn("Cloud sync upsert error:", error.message);
      return { success: false, message: error.message };
    }
    return { success: true };
  } catch (err) {
    console.warn("Could not save to Supabase cloud:", err);
    return { success: false, message: err.message };
  }
}

/**
 * Test Connection & Push Current Portfolio Data to Supabase
 */
export async function testAndSyncSupabase(url, key, currentPayload) {
  const cleanUrl = (url || "").trim();
  const cleanKey = (key || "").trim();

  if (!cleanUrl.startsWith("https://") || !cleanKey) {
    return { success: false, message: "Invalid URL or API Key format." };
  }

  try {
    const tempClient = createClient(cleanUrl, cleanKey, {
      auth: { persistSession: false },
    });

    // 1. Test table query
    const { error: testError } = await tempClient
      .from("portfolio_data")
      .select("id")
      .limit(1);

    if (testError) {
      return {
        success: false,
        message: `Database error: ${testError.message}. Make sure table 'portfolio_data' exists and has public RLS policies.`,
      };
    }

    // 2. Save current state
    if (currentPayload) {
      const saveRes = await saveCloudPortfolio(currentPayload, tempClient);
      if (!saveRes.success) {
        return {
          success: false,
          message: `Connected but sync failed: ${saveRes.message}`,
        };
      }
    }

    // 3. Save to localStorage & update global client
    if (typeof window !== "undefined") {
      localStorage.setItem("portfolio_supabase_url", cleanUrl);
      localStorage.setItem("portfolio_supabase_key", cleanKey);
    }
    supabaseInstance = tempClient;
    currentUrl = cleanUrl;
    currentKey = cleanKey;

    return {
      success: true,
      message: "Successfully connected to Supabase and synced all portfolio data to the cloud!",
    };
  } catch (err) {
    return {
      success: false,
      message: `Connection failed: ${err.message}`,
    };
  }
}
