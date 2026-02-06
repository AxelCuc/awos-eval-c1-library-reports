-- =====================================================
-- INDEXES.SQL
-- Índices para optimización de consultas y reportes
-- =====================================================

-- Acelera joins entre prestamos y ejemplares
CREATE INDEX IF NOT EXISTS idx_prestamos_ejemplar
ON prestamos (ejemplar_id);

-- Optimiza análisis de préstamos por socio y fechas
CREATE INDEX IF NOT EXISTS idx_prestamos_socio_fechas
ON prestamos (socio_id, fecha_vencimiento, fecha_devolucion);

-- Mejora agregaciones y filtros por fecha en multas
CREATE INDEX IF NOT EXISTS idx_multas_fecha_pago
ON multas (fecha_pago);
