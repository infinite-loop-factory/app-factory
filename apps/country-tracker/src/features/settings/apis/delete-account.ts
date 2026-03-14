import supabase from "@/lib/supabase";

export async function deleteAccount(userId: string): Promise<void> {
  // Try server-side RPC first (fully deletes auth user + data)
  const { error: rpcError } = await supabase.rpc("delete_account");

  if (!rpcError) return;

  // Fallback: client-side deletion (data only, auth user remains)
  const { error: locError } = await supabase
    .from("locations")
    .delete()
    .eq("user_id", userId);
  if (locError) throw locError;

  await supabase.from("profiles").delete().eq("id", userId);
  // Ignore profile error (table may not exist)

  const { error: signOutError } = await supabase.auth.signOut();
  if (signOutError) throw signOutError;
}
