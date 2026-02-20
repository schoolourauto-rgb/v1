-- Supabase RPC for atomic hot deal usage
create or replace function use_hot_deal_credit(user_id uuid, car_id uuid)
returns void as $$
begin
  -- Check credits
  if (select hot_deal_credits from profiles where id = user_id) < 1 then
    raise exception 'Not enough hot deal credits';
  end if;
  -- Deduct credit
  update profiles set hot_deal_credits = hot_deal_credits - 1 where id = user_id;
  -- Mark car as hot deal
  update cars set is_hot_deal = true where id = car_id;
end;
$$ language plpgsql security definer;
