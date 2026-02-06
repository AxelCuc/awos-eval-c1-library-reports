-- ============================================================
-- VIEW: vw_most_borrowed_books

-- Qué devuelve:
-- Ranking de los libros más prestados, mostrando cuántas veces
-- ha sido prestado cada libro y su posición relativa.

-- Grain:
-- Una fila por libro.

-- Métricas:
-- - total_prestamos (COUNT)
-- - ranking_prestamos (RANK)

-- Uso:
-- Permite análisis de popularidad de libros.
-- Soporta búsqueda por título/autor y paginación desde la app.

-- VERIFY:
-- SELECT * FROM vw_most_borrowed_books ORDER BY ranking_prestamos;
-- SELECT * FROM vw_most_borrowed_books WHERE autor ILIKE '%Martin%';
-- ============================================================

CREATE OR REPLACE VIEW vw_most_borrowed_books AS
SELECT
    l.id AS libro_id,
    l.titulo AS titulo,
    l.autor AS autor,
    l.categoria AS categoria,
    COUNT(p.id) AS total_prestamos,
    RANK() OVER (
        ORDER BY COUNT(p.id) DESC
    ) AS ranking_prestamos
FROM libros l
JOIN ejemplares e
    ON e.libro_id = l.id
JOIN prestamos p
    ON p.ejemplar_id = e.id
GROUP BY
    l.id,
    l.titulo,
    l.autor,
    l.categoria;

-- ============================================================
-- VIEW: vw_overdue_loans

-- Qué devuelve:
-- Préstamos vencidos activos, calculando los días de atraso
-- y un monto sugerido de multa en función del atraso.

-- Grain:
-- Una fila por préstamo vencido.
--
-- Métricas:
-- - dias_atraso (campo calculado)
-- - monto_sugerido (CASE)

-- Uso:
-- Permite identificar préstamos vencidos y estimar multas.
-- Soporta filtros por días mínimos de atraso y paginación.

-- VERIFY:
-- SELECT * FROM vw_overdue_loans ORDER BY dias_atraso DESC;
-- SELECT * FROM vw_overdue_loans WHERE dias_atraso >= 5;
-- ============================================================

CREATE OR REPLACE VIEW vw_overdue_loans AS
WITH prestamos_activos AS (
    SELECT
        p.id AS prestamo_id,
        s.nombre AS socio,
        l.titulo AS libro,
        p.fecha_prestamo,
        p.fecha_vencimiento,
        CURRENT_DATE - p.fecha_vencimiento AS dias_atraso
    FROM prestamos p
    JOIN socios s
        ON s.id = p.socio_id
    JOIN ejemplares e
        ON e.id = p.ejemplar_id
    JOIN libros l
        ON l.id = e.libro_id
    WHERE
        p.fecha_devolucion IS NULL
        AND p.fecha_vencimiento < CURRENT_DATE
)
SELECT
    prestamo_id,
    socio,
    libro,
    fecha_prestamo,
    fecha_vencimiento,
    dias_atraso,
    COUNT(prestamo_id) AS total_registros,
    CASE
        WHEN dias_atraso BETWEEN 1 AND 5 THEN dias_atraso * 5
        WHEN dias_atraso BETWEEN 6 AND 15 THEN dias_atraso * 8
        ELSE dias_atraso * 10
    END AS monto_sugerido
FROM prestamos_activos
GROUP BY
    prestamo_id,
    socio,
    libro,
    fecha_prestamo,
    fecha_vencimiento,
    dias_atraso;


-- ============================================================
-- VIEW: vw_fines_summary

-- Qué devuelve:
-- Resumen mensual de multas, separando montos pagados
-- y pendientes.

-- Grain:
-- Una fila por mes.

-- Métricas:
-- - total_multas
-- - monto_pagado
-- - monto_pendiente

-- Uso:
-- Permite analizar la recaudación y deuda de multas
-- por periodo. Soporta filtros por rango de fechas.

-- VERIFY:
-- SELECT * FROM vw_fines_summary ORDER BY mes;
-- SELECT * FROM vw_fines_summary WHERE monto_pendiente > 0;
-- ============================================================

CREATE OR REPLACE VIEW vw_fines_summary AS
SELECT
    CAST(
        DATE_TRUNC('month', COALESCE(m.fecha_pago, p.fecha_vencimiento))
        AS DATE
    ) AS mes,
    COUNT(m.id)AS total_multas,
    SUM(
        CASE
            WHEN m.fecha_pago IS NOT NULL THEN m.monto
            ELSE 0
        END
    ) AS monto_pagado,
    SUM(
        CASE
            WHEN m.fecha_pago IS NULL THEN m.monto
            ELSE 0
        END
    ) AS monto_pendiente
FROM multas m
JOIN prestamos p
    ON p.id = m.prestamo_id
GROUP BY
    DATE_TRUNC('month', COALESCE(m.fecha_pago, p.fecha_vencimiento))
HAVING
    COUNT(m.id) > 0;


-- ============================================================
-- VIEW: vw_member_activity

-- Qué devuelve:
-- Actividad de los socios de la biblioteca, incluyendo
-- el total de préstamos, préstamos vencidos y su tasa
-- de atraso.

-- Grain:
-- Una fila por socio.

-- Métricas:
-- - total_prestamos
-- - prestamos_vencidos
-- - tasa_atraso (porcentaje)

-- Uso:
-- Permite identificar socios más activos y con mayor
-- nivel de incumplimiento. Soporta filtros y paginación.

-- VERIFY:
-- SELECT * FROM vw_member_activity ORDER BY tasa_atraso DESC;
-- SELECT * FROM vw_member_activity WHERE total_prestamos > 1;
-- ============================================================

CREATE OR REPLACE VIEW vw_member_activity AS
SELECT
    s.id AS socio_id,
    s.nombre AS socio,
    s.tipo_socio AS tipo_socio,
    COUNT(p.id) AS total_prestamos,
    SUM(
        CASE
            WHEN p.fecha_devolucion IS NULL
                 AND p.fecha_vencimiento < CURRENT_DATE
            THEN 1
            ELSE 0
        END
    ) AS prestamos_vencidos,
    CASE
        WHEN COUNT(p.id) = 0 THEN 0
        ELSE ROUND(
            (
                SUM(
                    CASE
                        WHEN p.fecha_devolucion IS NULL
                             AND p.fecha_vencimiento < CURRENT_DATE
                        THEN 1
                        ELSE 0
                    END
                )::NUMERIC
                / COUNT(p.id)
            ) * 100,
            2
        )
    END AS tasa_atraso
FROM socios s
LEFT JOIN prestamos p
    ON p.socio_id = s.id
GROUP BY
    s.id,
    s.nombre,
    s.tipo_socio
HAVING
    COUNT(p.id) >= 0;


-- ============================================================
-- VIEW: vw_inventory_health

-- Qué devuelve:
-- Estado de salud del inventario por categoría de libro,
-- mostrando la cantidad de ejemplares disponibles, prestados
-- y perdidos.

-- Grain:
-- Una fila por categoría.

-- Métricas:
-- - total_ejemplares
-- - ejemplares_disponibles
-- - ejemplares_prestados
-- - ejemplares_perdidos
-- - porcentaje_disponibles

-- Uso:
-- Permite evaluar la disponibilidad y estado del inventario
-- para la toma de decisiones.

-- VERIFY:
-- SELECT * FROM vw_inventory_health;
-- SELECT * FROM vw_inventory_health WHERE porcentaje_disponibles < 50;
-- ============================================================

CREATE OR REPLACE VIEW vw_inventory_health AS
SELECT
    l.categoria AS categoria,
    COUNT(e.id) AS total_ejemplares,
    SUM(
        CASE WHEN e.estado = 'disponible' THEN 1 ELSE 0 END
    ) AS ejemplares_disponibles,
    SUM(
        CASE WHEN e.estado = 'prestado' THEN 1 ELSE 0 END
    ) AS ejemplares_prestados,
    SUM(
        CASE WHEN e.estado = 'perdido' THEN 1 ELSE 0 END
    ) AS ejemplares_perdidos,
    ROUND(
        COALESCE(
            (
                SUM(
                    CASE WHEN e.estado = 'disponible' THEN 1 ELSE 0 END
                )::NUMERIC
                / NULLIF(COUNT(e.id), 0)
            ) * 100,
            0
        ),
        2
    ) AS porcentaje_disponibles
FROM libros l
JOIN ejemplares e
    ON e.libro_id = l.id
GROUP BY
    l.categoria;
