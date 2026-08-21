-- Postgres training schema (ecommerce). Seedable, sized for real EXPLAIN ANALYZE.
-- Spin up:  docker run --name pg-train -e POSTGRES_PASSWORD=pg -p 5433:5432 -d postgres:16
-- Load:     psql "postgresql://postgres:pg@localhost:5433/postgres" -f schema.sql
-- Then:     psql "postgresql://postgres:pg@localhost:5433/postgres"

DROP TABLE IF EXISTS order_items, payments, orders, products, users CASCADE;

CREATE TABLE users (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email       TEXT UNIQUE NOT NULL,
  full_name   TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE products (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name        TEXT NOT NULL,
  category    TEXT NOT NULL,
  price_cents INT  NOT NULL CHECK (price_cents >= 0),
  stock       INT  NOT NULL DEFAULT 0 CHECK (stock >= 0),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE orders (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id     BIGINT NOT NULL REFERENCES users(id),
  status      TEXT   NOT NULL DEFAULT 'pending'
              CHECK (status IN ('pending','paid','shipped','delivered','cancelled')),
  total_cents INT    NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE order_items (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_id    BIGINT NOT NULL REFERENCES orders(id),
  product_id  BIGINT NOT NULL REFERENCES products(id),
  quantity    INT    NOT NULL CHECK (quantity > 0),
  price_cents INT    NOT NULL
);

CREATE TABLE payments (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_id    BIGINT NOT NULL REFERENCES orders(id),
  provider    TEXT   NOT NULL DEFAULT 'razorpay',
  amount_cents INT   NOT NULL,
  status      TEXT   NOT NULL CHECK (status IN ('created','captured','failed','refunded')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---- Seed data (adjust multipliers if your machine is slow) ----
INSERT INTO users (email, full_name, created_at)
SELECT 'user' || g || '@example.com',
       'User ' || g,
       now() - (random() * interval '365 days')
FROM generate_series(1, 200000) g;

INSERT INTO products (name, category, price_cents, stock)
SELECT 'Product ' || g,
       (ARRAY['books','electronics','fashion','home','toys','beauty'])[1 + (g % 6)],
       (100 + (random() * 500000))::int,
       (random() * 1000)::int
FROM generate_series(1, 5000) g;

-- ~1M orders spread across the last year, skewed toward recent
INSERT INTO orders (user_id, status, total_cents, created_at)
SELECT 1 + (random() * 199999)::int,
       (ARRAY['pending','paid','paid','paid','shipped','delivered','cancelled'])[1 + (random()*6)::int],
       0,
       now() - (random() * random() * interval '365 days')
FROM generate_series(1, 1000000) g;

-- 1–4 items per order
INSERT INTO order_items (order_id, product_id, quantity, price_cents)
SELECT o.id,
       1 + (random() * 4999)::int,
       1 + (random() * 3)::int,
       (100 + (random() * 500000))::int
FROM orders o, generate_series(1, 1 + (random() * 3)::int) s;

UPDATE orders o
SET total_cents = sub.total
FROM (SELECT order_id, SUM(quantity * price_cents) AS total
      FROM order_items GROUP BY order_id) sub
WHERE o.id = sub.order_id;

INSERT INTO payments (order_id, amount_cents, status, created_at)
SELECT id, total_cents,
       CASE status WHEN 'pending' THEN 'created'
                   WHEN 'cancelled' THEN 'failed'
                   ELSE 'captured' END,
       created_at + interval '2 minutes'
FROM orders;

ANALYZE;

-- NOTE: schema.sql intentionally ships with NO secondary indexes (only PKs +
-- the users.email UNIQUE). Deciding and adding the right ones is part of the
-- challenges — that's the whole point of P1 and P2.
