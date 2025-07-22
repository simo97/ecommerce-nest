-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE user_role AS ENUM ('customer', 'admin');
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled');

-- Set timezone
SET timezone = 'UTC';

-- Log initialization
INSERT INTO pg_stat_statements_info VALUES ('Database initialized successfully')
ON CONFLICT DO NOTHING;