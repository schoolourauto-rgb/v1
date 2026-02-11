-- Paste your RLS policy export here.
-- Example: CREATE POLICY, ALTER POLICY, etc.

-- Dealer RLS policies
create policy "Dealer select own profile"
on dealers
for select
using (user_id = auth.uid());

create policy "Dealer update own profile"
on dealers
for update
using (user_id = auth.uid());
