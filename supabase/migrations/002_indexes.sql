create index idx_invites_token     on invites(token);
create index idx_invites_status    on invites(status);
create index idx_responses_invite  on responses(invite_id);
create index idx_history_invite    on response_history(invite_id);
create index idx_history_submitted on response_history(submitted_at desc);
