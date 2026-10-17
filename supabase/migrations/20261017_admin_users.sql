-- Run in the Supabase SQL editor (or as a migration).
-- Lets admins list users + invitation status WITHOUT exposing anyone's time entries.

create or replace function public.admin_list_users()
returns table (
  id uuid,
  email text,
  full_name text,
  role text,
  is_active boolean,
  created_at timestamptz,
  invited_at timestamptz,
  last_sign_in_at timestamptz,
  password_set boolean
)
language sql
stable
security definer
set search_path = public, auth
as $$
  select
    p.id,
    p.email,
    p.full_name,
    p.role,
    p.is_active,
    p.created_at,
    u.invited_at,
    u.last_sign_in_at,
    coalesce((u.raw_user_meta_data ->> 'password_set')::boolean, false)
  from public.profiles p
  join auth.users u on u.id = p.id
  where public.is_admin()          -- non-admins get zero rows
  order by p.created_at desc;
$$;

revoke all on function public.admin_list_users() from public, anon;
grant execute on function public.admin_list_users() to authenticated;
