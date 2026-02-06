Este script define el orden lógico de ejecución
-- de los objetos de base de datos para garantizar
-- consistencia y reproducibilidad del entorno.
-- =====================================================

-- 1. Esquema base (tablas y relaciones)
\i /docker-entrypoint-initdb.d/schema.sql

-- 2. Datos de prueba (seed)
\i /docker-entrypoint-initdb.d/seed.sql

-- 3. Vistas de reportes
-- (se crean después de tener datos y relaciones)
\i /docker-entrypoint-initdb.d/reports_vw.sql

-- 4. Índices para optimización
\i /docker-entrypoint-initdb.d/indexes.sql

-- 5. Seguridad y roles
\i /docker-entrypoint-initdb.d/roles.sql