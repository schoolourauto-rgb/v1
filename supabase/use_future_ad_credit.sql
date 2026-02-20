-- Supabase RPC for atomic future ad usage
create or replace function use_future_ad_credit(user_id uuid, ad_id uuid)
returns void as $$
begin
  -- Check credits
  if (select future_ad_credits from profiles where id = user_id) < 1 then
    raise exception 'Not enough future ad credits';
  end if;
  -- Deduct credit
  update profiles set future_ad_credits = future_ad_credits - 1 where id = user_id;
  -- Mark ad as scheduled (implement as needed)
  update cars set is_scheduled = true where id = ad_id;
end;
$$ language plpgsql security definer;
