// Moved to /docs/DATABASE_SETUP.md
# 🚀 Supabase Database & Storage Setup Guide

## ✅ Step 1: Create `cars` Table

Go to **Supabase Dashboard → SQL Editor → New Query** and run:

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
  fuel_type TEXT NOT NULL,
  transmission TEXT NOT NULL,
  color TEXT,
  description TEXT,
  status TEXT CHECK (status IN ('draft', 'active', 'sold')) DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_cars_dealer_id ON cars(dealer_id);
CREATE INDEX idx_cars_status ON cars(status);

-- Enable RLS
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;

-- RLS Policies
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

-- Allow public to view active cars (for marketplace listing)
CREATE POLICY "Public can view active cars"
  ON cars FOR SELECT
  USING (status = 'active');
```

---

## ✅ Step 2: Create `car_images` Table

```sql
CREATE TABLE car_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  car_id UUID NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create index
CREATE INDEX idx_car_images_car_id ON car_images(car_id);

-- Enable RLS
ALTER TABLE car_images ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public can view car images for active cars"
  ON car_images FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM cars 
      WHERE cars.id = car_images.car_id 
      AND (cars.status = 'active' OR cars.dealer_id = auth.uid())
    )
  );

CREATE POLICY "Dealers can insert images for their cars"
  ON car_images FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM cars
      WHERE cars.id = car_images.car_id
      AND cars.dealer_id = auth.uid()
    )
  );

CREATE POLICY "Dealers can delete images from their cars"
  ON car_images FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM cars
      WHERE cars.id = car_images.car_id
      AND cars.dealer_id = auth.uid()
    )
  );
```

---

## ✅ Step 3: Create Storage Bucket

### Via Supabase Dashboard:

1. Go to **Storage** in left sidebar
2. Click **Create a new bucket**
3. Name: `car-images`
4. **⚠️ IMPORTANT: Toggle "Public bucket" ON** ✅
5. Click **Create bucket**

### Storage Policy (Run in SQL Editor):

```sql
CREATE POLICY "Allow authenticated uploads"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'car-images' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Allow public read"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'car-images'
  );

CREATE POLICY "Allow dealers to delete own uploads"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'car-images' 
    AND owner = auth.uid()
  );
```

---

## ✅ Step 4: Update `.env.local`

Make sure you have:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

(Get from: Supabase → Settings → API)

---

## 🧪 Test the Flow

1. **Navigate to Add Car page:**
   ```
   http://localhost:3000/dealer/add-car
   ```

2. **Fill the form:**
   - Car details
   - Upload 5+ images
   - Click "List Car on Marketplace"

3. **Check Supabase:**
   - Go to Database → cars table → new row should appear
   - Go to Database → car_images table → 5 rows should appear
   - Go to Storage → car-images → check uploaded files

---

## 🔒 Security Summary

✅ **Row Level Security (RLS):** 
- Dealers can only see/edit their own cars
- Public can only see active cars
- Car images follow the same rules

✅ **Storage:**
- Public read access (for marketplace)
- Authenticated write access (only dealers)
- Dealers can delete own uploads

✅ **Database Types:**
- Full TypeScript support
- Car & car_images tables
- Proper foreign keys

---

## 🚀 Next: Dashboard Car Grid

After testing add-car, build:

```
app/dealer/dashboard/page.tsx
```

Features:
- Fetch dealer's all cars (draft + active)
- Display in grid
- Count towards 6-car minimum
- Edit/Delete buttons
- Status toggle (draft → active)

---

**Setup complete! Car system ready! 🔥**
