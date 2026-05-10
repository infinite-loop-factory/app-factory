-- RPC function to fully delete a user's account
-- Called from the client via supabase.rpc('delete_account')
-- Uses SECURITY DEFINER to access auth.users with elevated privileges

create or replace function public.delete_account()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid;
begin
  -- Get the ID of the currently authenticated user
  current_user_id := auth.uid();

  if current_user_id is null then
    raise exception 'Not authenticated';
  end if;

  -- Delete all location records
  delete from public.locations where user_id = current_user_id;

  -- Delete profile if exists
  delete from public.profiles where id = current_user_id;

  -- Delete the auth user (cascades auth-related data)
  delete from auth.users where id = current_user_id;
end;
$$;

-- Grant execute permission to authenticated users only
grant execute on function public.delete_account() to authenticated;
