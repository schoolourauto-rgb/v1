-- Paste your RLS policy export here.
-- Example: CREATE POLICY, ALTER POLICY, etc.
-- Cars RLS policies
create policy "Dealer manages own cars"
on cars
for all
using (
	dealer_id in (
		select id from dealers where user_id = auth.uid()
	)
);

create policy "Public can view cars"
on cars
for select
using (true);
-- Dealer RLS policies
create policy "Dealer select own profile"
on dealers
for select
using (user_id = auth.uid());

create policy "Dealer update own profile"
on dealers
for update
using (user_id = auth.uid());
