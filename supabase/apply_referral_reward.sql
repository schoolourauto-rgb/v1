-- Supabase RPC for atomic referral reward
create or replace function apply_referral_reward(referrer_id uuid, referred_id uuid)
returns void as $$
begin
  -- Prevent duplicate
  if exists (select 1 from referral_rewards where referrer_id = referrer_id and referred_id = referred_id) then
    return;
  end if;
  -- Insert referral
  insert into referral_rewards (referrer_id, referred_id) values (referrer_id, referred_id);
  -- Update referred_by
  update profiles set referred_by = referrer_id where id = referred_id;
  -- Add credits
  update profiles set future_ad_credits = coalesce(future_ad_credits,0) + 5 where id = referrer_id;
end;
$$ language plpgsql security definer;
