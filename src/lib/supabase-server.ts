import { createClient, type User } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export function isServerSupabaseConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}

export function createServerSupabaseClient(token?: string) {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    },
  });
}

export async function verifyAuthToken(
  req: Request,
): Promise<{ user: User | null; error: string | null }> {
  if (!isServerSupabaseConfigured()) {
    return { user: null, error: "Supabase belum dikonfigurasi di server" };
  }

  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { user: null, error: "Header otentikasi tidak ditemukan" };
  }

  const token = authHeader.replace("Bearer ", "").trim();
  if (!token) {
    return { user: null, error: "Token otentikasi kosong" };
  }

  const client = createServerSupabaseClient(token);
  const { data, error } = await client.auth.getUser(token);

  if (error || !data.user) {
    return {
      user: null,
      error: error?.message || "Token otentikasi tidak valid atau kedaluwarsa",
    };
  }

  return { user: data.user, error: null };
}
