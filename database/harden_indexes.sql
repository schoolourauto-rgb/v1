-- Composite and single indexes for cars table
CREATE INDEX IF NOT EXISTS idx_cars_city ON cars(city_id);
CREATE INDEX IF NOT EXISTS idx_cars_price ON cars(price);
CREATE INDEX IF NOT EXISTS idx_cars_dealer ON cars(dealer_id);
CREATE INDEX IF NOT EXISTS idx_cars_fuel ON cars(fuel_type);
CREATE INDEX IF NOT EXISTS idx_cars_city_price ON cars(city_id, price);
CREATE INDEX IF NOT EXISTS idx_cars_city_fuel ON cars(city_id, fuel_type);
CREATE INDEX IF NOT EXISTS idx_cars_city_dealer ON cars(city_id, dealer_id);
CREATE INDEX IF NOT EXISTS idx_cars_city_price_fuel ON cars(city_id, price, fuel_type);
