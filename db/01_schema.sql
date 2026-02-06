-- ==========================================
-- ESQUEMA BASE DE DATOS
-- Sistema de Reportes - Biblioteca
-- ==========================================

DROP TABLE IF EXISTS multas;
DROP TABLE IF EXISTS prestamos;
DROP TABLE IF EXISTS ejemplares;
DROP TABLE IF EXISTS libros;
DROP TABLE IF EXISTS socios;

-- ==========================================
-- SOCIOS DE LA BIBLIOTECA
-- ==========================================
CREATE TABLE socios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    tipo_socio VARCHAR(20) NOT NULL
        CHECK (tipo_socio IN ('estudiante', 'docente', 'externo')),
    fecha_alta DATE NOT NULL DEFAULT CURRENT_DATE
);

-- ==========================================
-- LIBROS (ENTIDAD LÓGICA)
-- ==========================================
CREATE TABLE libros (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    autor VARCHAR(150) NOT NULL,
    categoria VARCHAR(80) NOT NULL,
    isbn VARCHAR(20) UNIQUE NOT NULL
);

-- ==========================================
-- EJEMPLARES FÍSICOS
-- ==========================================
CREATE TABLE ejemplares (
    id SERIAL PRIMARY KEY,
    libro_id INT NOT NULL,
    codigo_barra VARCHAR(50) UNIQUE NOT NULL,
    estado VARCHAR(20) NOT NULL
        CHECK (estado IN ('disponible', 'prestado', 'perdido')),
    CONSTRAINT fk_ejemplar_libro
        FOREIGN KEY (libro_id)
        REFERENCES libros(id)
);

-- ==========================================
-- PRÉSTAMOS
-- ==========================================
CREATE TABLE prestamos (
    id SERIAL PRIMARY KEY,
    ejemplar_id INT NOT NULL,
    socio_id INT NOT NULL,
    fecha_prestamo DATE NOT NULL,
    fecha_vencimiento DATE NOT NULL,
    fecha_devolucion DATE,
    CONSTRAINT fk_prestamo_ejemplar
        FOREIGN KEY (ejemplar_id)
        REFERENCES ejemplares(id),
    CONSTRAINT fk_prestamo_socio
        FOREIGN KEY (socio_id)
        REFERENCES socios(id)
);

-- ==========================================
-- MULTAS
-- ==========================================
CREATE TABLE multas (
    id SERIAL PRIMARY KEY,
    prestamo_id INT NOT NULL,
    monto NUMERIC(10,2) NOT NULL CHECK (monto >= 0),
    fecha_pago DATE,
    CONSTRAINT fk_multa_prestamo
        FOREIGN KEY (prestamo_id)
        REFERENCES prestamos(id)
);
