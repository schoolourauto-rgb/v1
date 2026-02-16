# Test Structure

- `test/api/` — API and schema validation tests
- Use `jest` or `vitest` for running tests
- Add integration tests for RLS by simulating user sessions and privilege boundaries

## Auth Flow Test Outline
- Register user
- Login user
- Access protected route (should succeed)
- Access another user's resource (should fail)

## RLS Testing Strategy
- Use Supabase test users
- Attempt insert/update with/without proper session
- Assert RLS blocks unauthorized access
