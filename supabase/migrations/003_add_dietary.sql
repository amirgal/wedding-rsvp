-- Add dietary preference columns to responses table
alter table responses
add column vegan_count int not null default 0 check (vegan_count >= 0),
add column gluten_free_count int not null default 0 check (gluten_free_count >= 0);

-- Add dietary preference columns to response_history table
alter table response_history
add column vegan_count int not null default 0,
add column gluten_free_count int not null default 0;
