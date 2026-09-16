import { supabaseServer } from "./supabase-server";

export const ADMIN_EMAIL = "reddysubramanyam.h@gmail.com";

export async function requireAdmin() {
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email?.toLowerCase() !== ADMIN_EMAIL) {
    throw new Error("UNAUTHORIZED");
  }
  return user;
}
