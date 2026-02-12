-- Migrate from single user_templates row to multi-project support.
-- Each project holds one set of templates (formerly PersistedData).

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null default 'My Project',
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index projects_user_id_idx on public.projects(user_id);

alter table public.projects enable row level security;

create policy "Users can read own projects" on public.projects
  for select using (auth.uid() = user_id);
create policy "Users can insert own projects" on public.projects
  for insert with check (auth.uid() = user_id);
create policy "Users can update own projects" on public.projects
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can delete own projects" on public.projects
  for delete using (auth.uid() = user_id);

create trigger on_projects_updated
  before update on public.projects
  for each row execute function public.handle_updated_at();

-- Migrate existing user_templates data into projects table
insert into public.projects (user_id, name, data)
select user_id, 'My Project', data
from public.user_templates;
