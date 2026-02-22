create table invites (
  id         uuid primary key default gen_random_uuid(),
  token      uuid unique not null default gen_random_uuid(),
  name       text not null,
  phone      text,
  status     text not null default 'pending'
               check (status in ('pending','opened','submitted','edited')),
  created_at timestamptz not null default now()
);

create table responses (
  id           uuid primary key default gen_random_uuid(),
  invite_id    uuid not null references invites(id) on delete cascade,
  attending    boolean not null,
  adult_count  int not null default 0 check (adult_count >= 0),
  kid_count    int not null default 0 check (kid_count >= 0),
  submitted_at timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (invite_id)
);

create table response_history (
  id           uuid primary key default gen_random_uuid(),
  invite_id    uuid not null references invites(id) on delete cascade,
  attending    boolean not null,
  adult_count  int not null default 0,
  kid_count    int not null default 0,
  submitted_at timestamptz not null default now()
);

-- RLS: all access goes through service role in API routes
alter table invites          enable row level security;
alter table responses        enable row level security;
alter table response_history enable row level security;

create policy "deny_all" on invites          for all using (false);
create policy "deny_all" on responses        for all using (false);
create policy "deny_all" on response_history for all using (false);
