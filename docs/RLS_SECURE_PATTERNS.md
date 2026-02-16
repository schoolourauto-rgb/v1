# RLS Secure Insert/Update Patterns

## Principle
- Never trust client-provided dealer_id or user_id
- Always inject user identity server-side from session

## Example (TypeScript, Supabase)

```ts
// Secure insert for cars
const {
  data: { session },
} = await supabase.auth.getSession();
if (!session) throw new Error("Not authenticated");

const { data: dealer } = await supabase
  .from("dealers")
  .select("id")
  .eq("user_id", session.user.id)
  .single();
if (!dealer) throw new Error("Dealer not found");

const insertPayload = {
  ...validatedData,
  dealer_id: dealer.id, // Injected, not from client
};
await supabase.from("cars").insert([insertPayload]);
```

## Policy Recommendations
- All RLS policies should check user_id = auth.uid()
- Never allow direct client writes to dealer_id/user_id fields
- Use `EXISTS` subqueries for ownership checks
- Log all failed RLS attempts
