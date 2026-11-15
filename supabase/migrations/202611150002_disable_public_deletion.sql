begin;

-- Block direct REST deletion and truncation, even when older RLS policies allow ALL.
revoke delete, truncate on public.topics, public.words, public.leaderboard
  from public, anon, authenticated;

-- Also block deletion through SECURITY DEFINER RPCs: the caller's JWT role
-- survives a function's privilege elevation. Trusted service-role/SQL maintenance
-- remains available; the service-role key must never be shipped to the browser.
create or replace function public.reject_public_deletion()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if auth.role() in ('anon', 'authenticated') then
    raise exception 'Public deletion is disabled' using errcode = '42501';
  end if;
  return null;
end;
$$;

revoke all on function public.reject_public_deletion() from public, anon, authenticated;

drop trigger if exists reject_public_deletion on public.topics;
create trigger reject_public_deletion before delete or truncate on public.topics
  for each statement execute function public.reject_public_deletion();
drop trigger if exists reject_public_deletion on public.words;
create trigger reject_public_deletion before delete or truncate on public.words
  for each statement execute function public.reject_public_deletion();
drop trigger if exists reject_public_deletion on public.leaderboard;
create trigger reject_public_deletion before delete or truncate on public.leaderboard
  for each statement execute function public.reject_public_deletion();

commit;
