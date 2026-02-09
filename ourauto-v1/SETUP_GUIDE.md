# 🚀 OurAuto V1 - Complete Setup Guide

## ✅ What We've Built So Far

### 📁 Project Structure
```
lib/
├── supabase/
│   ├── client.ts       (Browser client)
│   ├── server.ts       (Server client)
│   └── types.ts        (Database types)

app/
├── (auth)/
│   ├── signup/page.tsx (Dealer signup)
│   └── login/page.tsx  (Dealer login)
├── dealer/
│   ├── dashboard/page.tsx (Protected route)
│   └── onboarding/page.tsx (6-car minimum)
└── page.tsx            (Home landing)

middleware.ts          (Protected route guard)
.env.local.example     (Config template)
```

---

## 🔒 Supabase Database Setup

### Step 1: Create `profiles` Table

Go to Supabase Dashboard → SQL Editor → Create new query:

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  role TEXT CHECK (role IN ('dealer', 'admin', 'customer')) DEFAULT 'dealer',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);
```

---

### Step 2: Create `cars` Table

```sql
CREATE TABLE cars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dealer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  price BIGINT NOT NULL,
  mileage INTEGER NOT NULL,
  fuel_type TEXT,
  transmission TEXT,
  color TEXT,
  description TEXT,
  images TEXT[] DEFAULT '{}',
  status TEXT CHECK (status IN ('draft', 'active', 'sold')) DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE cars ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Dealers can view their own cars"
  ON cars FOR SELECT
  USING (auth.uid() = dealer_id);

CREATE POLICY "Dealers can insert their own cars"
  ON cars FOR INSERT
  WITH CHECK (auth.uid() = dealer_id);

CREATE POLICY "Dealers can update their own cars"
  ON cars FOR UPDATE
  USING (auth.uid() = dealer_id);

CREATE POLICY "Dealers can delete their own cars"
  ON cars FOR DELETE
  USING (auth.uid() = dealer_id);
```

---

## ⚙️ Environment Setup

### 1. Copy the example file:
```bash
cp .env.local.example .env.local
```

### 2. Add your Supabase keys to `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

(Get these from: Supabase Dashboard → Settings → API)

---

## 🧪 Test the Flow

### Start dev server:
```bash
npm run dev
```

### Visit in order:
1. **Home** → `http://localhost:3000`
2. **Signup** → `http://localhost:3000/signup`
3. **Login** → `http://localhost:3000/login`
4. **Dashboard** → `http://localhost:3000/dealer/dashboard` (Protected)
5. **Onboarding** → `http://localhost:3000/dealer/onboarding` (Protected)

---

## 🔄 Auth Flow

✅ User signs up with email/password
✅ Auto-creates profile in `profiles` table
✅ Redirects to onboarding (6 cars minimum)
✅ Middleware protects `/dealer/*` routes
✅ Auto-redirect to login if not authenticated

---

## 🚀 Next Steps (Choose One)

### Option 1: Build Add Car Form
- Create `/app/dealer/cars/new/page.tsx`
- Form with image upload
- Save to `cars` table
- Count towards 6-car minimum

### Option 2: Build Protected Logout + Header
- Create header component
- Add logout button
- User dropdown
- Apply to all dealer pages

### Option 3: Build Car Listing Grid
- Fetch dealer's cars
- Display on dashboard
- Edit/delete functionality
- Status indicators (draft/active/sold)

---

## 🔔 Important Notes

- ⚡ **Middleware** automatically protects `/dealer/*` routes
- 🔐 **Row Level Security** ensures users only access own data
- 📱 **Mobile responsive** - all components use Tailwind CSS
- 🎨 **Dark luxury theme** - black background with yellow accents
- 📝 **TypeScript ready** - full type safety with database types

---

**Boss! 🔥 Foundation thayu solid. Next step ne bolao!**
