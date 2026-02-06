-- ==========================================
-- SEED DATA REFORZADO
-- Sistema de Biblioteca
-- ==========================================

TRUNCATE multas, prestamos, ejemplares, libros, socios
RESTART IDENTITY CASCADE;

-- ==========================================
-- SOCIOS
-- ==========================================
INSERT INTO socios (nombre, email, tipo_socio, fecha_alta) VALUES
('Ana Torres', 'ana@uni.edu', 'estudiante', '2023-01-10'),
('Luis Gómez', 'luis@uni.edu', 'estudiante', '2023-02-15'),
('María López', 'maria@uni.edu', 'docente', '2022-08-01'),
('Carlos Ruiz', 'carlos@ext.com', 'externo', '2021-06-20'),
('Elena Martínez', 'elena@uni.edu', 'estudiante', '2024-01-05'),
('Jorge Ramírez', 'jorge@uni.edu', 'estudiante', '2024-02-01'); -- socio sin actividad

-- ==========================================
-- LIBROS
-- ==========================================
INSERT INTO libros (titulo, autor, categoria, isbn) VALUES
('Clean Code', 'Robert C. Martin', 'Software', '9780132350884'),
('Design Patterns', 'Erich Gamma', 'Software', '9780201633610'),
('Sistemas de Bases de Datos', 'Elmasri & Navathe', 'Bases de Datos', '9780133970777'),
('Introducción a Algoritmos', 'Cormen', 'Algoritmos', '9780262033848'),
('Sistemas Operativos', 'Silberschatz', 'Sistemas', '9781118063330'),
('Arquitectura de Software', 'Bass', 'Software', '9780135882735');

-- ==========================================
-- EJEMPLARES
-- ==========================================
INSERT INTO ejemplares (libro_id, codigo_barra, estado) VALUES
-- Clean Code
(1, 'CC-001', 'prestado'),
(1, 'CC-002', 'prestado'),
(1, 'CC-003', 'disponible'),

-- Design Patterns
(2, 'DP-001', 'prestado'),
(2, 'DP-002', 'prestado'),

-- Bases de Datos
(3, 'BD-001', 'disponible'),
(3, 'BD-002', 'perdido'),

-- Algoritmos
(4, 'ALG-001', 'prestado'),
(4, 'ALG-002', 'disponible'),

-- Sistemas Operativos
(5, 'SO-001', 'prestado'),

-- Arquitectura de Software
(6, 'AS-001', 'prestado'),
(6, 'AS-002', 'disponible');

-- ==========================================
-- PRÉSTAMOS
-- ==========================================
INSERT INTO prestamos (
    ejemplar_id, socio_id,
    fecha_prestamo, fecha_vencimiento, fecha_devolucion
) VALUES
-- Ana (muy activa)
(1, 1, CURRENT_DATE - INTERVAL '40 days', CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE - INTERVAL '28 days'),
(2, 1, CURRENT_DATE - INTERVAL '25 days', CURRENT_DATE - INTERVAL '15 days', NULL),
(4, 1, CURRENT_DATE - INTERVAL '10 days', CURRENT_DATE - INTERVAL '2 days', NULL),

-- Luis (atrasos)
(5, 2, CURRENT_DATE - INTERVAL '20 days', CURRENT_DATE - INTERVAL '10 days', NULL),
(8, 2, CURRENT_DATE - INTERVAL '12 days', CURRENT_DATE - INTERVAL '5 days', NULL),

-- María (correcta)
(9, 3, CURRENT_DATE - INTERVAL '7 days', CURRENT_DATE + INTERVAL '7 days', NULL),

-- Carlos (histórico)
(10, 4, CURRENT_DATE - INTERVAL '60 days', CURRENT_DATE - INTERVAL '45 days', CURRENT_DATE - INTERVAL '40 days'),

-- Elena (poco uso)
(11, 5, CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE + INTERVAL '10 days', NULL);

-- ==========================================
-- MULTAS
-- ==========================================
INSERT INTO multas (prestamo_id, monto, fecha_pago) VALUES
-- multas pendientes
(2, 50.00, NULL),
(4, 25.00, NULL),

-- multas pagadas en meses distintos
(1, 30.00, CURRENT_DATE - INTERVAL '25 days'),
(7, 15.00, CURRENT_DATE - INTERVAL '50 days'),
(8, 20.00, CURRENT_DATE - INTERVAL '3 days');
