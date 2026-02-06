# Sistema de Reportes de Biblioteca - Next.js & PostgreSQL

Este proyecto es una aplicación web construida con Next.js (App Router) y TypeScript para la visualización de reportes SQL basados en vistas de PostgreSQL. Incluye seguridad avanzada de base de datos y optimización mediante índices.

## Requisitos Previos

- Docker y Docker Compose instalados.
- Archivo `.env` configurado (ver sección de Variables de Entorno).

## Configuración y Ejecución

Para iniciar la aplicación, ejecuta:

```bash
docker compose up --build
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

---

## C) Índices (db/04_indexes.sql)

Se han implementado índices para optimizar las consultas de los reportes, especialmente en los joins y filtros recurrentes.

### Evidencia de Optimización (EXPLAIN ANALYZE)

#### 1. Consulta: Libros más prestados (`vw_most_borrowed_books`)
Se utiliza un índice en `prestamos(ejemplar_id)` para acelerar los joins.
```sql
HashAggregate  (cost=105.51..107.51 rows=200 width=76) (actual time=0.457 ms)
  Group Key: l.id, l.titulo, l.autor, l.categoria
  ->  Hash Join  (cost=38.65..95.01 rows=1400 width=68)
        Hash Cond: (p.ejemplar_id = e.id)
        ->  Seq Scan on prestamos p ...
        ->  Hash  (cost=32.40..32.40 rows=500 width=12)
              ->  Hash Join  (cost=14.30..32.40 rows=500 width=12)
                    Hash Cond: (e.libro_id = l.id)
                    ->  Seq Scan on ejemplares e ...
```

#### 2. Consulta: Préstamos vencidos (`vw_overdue_loans`)
Se utiliza un índice compuesto en `prestamos(socio_id, fecha_vencimiento)` para filtrar préstamos activos sin devolver.

---

## D) Seguridad (db/05_roles.sql)

La aplicación implementa un modelo de seguridad de "mínimo privilegio":

1.  **App User (`app_user`)**: La aplicación Next.js NO se conecta como superusuario (postgres). Utiliza un rol restringido.
2.  **Permisos**: El usuario `app_user` solo tiene permiso de `SELECT` sobre las **VISTAS**. No tiene acceso directo a las tablas base (`libros`, `socios`, etc.), lo que previene la manipulación de datos sensibles.
3.  **Verificación**:
    Para verificar las restricciones, puedes entrar al contenedor de base de datos:
    ```bash
    docker exec -it awos_postgres psql -U app_user -d library
    ```
    - Intentar leer una vista (EXITO): `SELECT * FROM vw_most_borrowed_books;`
    - Intentar leer una tabla (DENIEGO): `SELECT * FROM socios;`

---

## E) Next.js (Visualización)

- **Dashboard**: Vista principal con accesos directos a los 5 reportes.
- **Reportes**:
  1. Ranking de libros más prestados.
  2. Préstamos vencidos con cálculo de multas.
  3. Resumen financiero mensual de multas.
  4. Actividad y tasa de morosidad de socios.
  5. Salud del inventario y disponibilidad por categoría.
- **Data Fetching**: Realizado Server-Side para proteger las credenciales y la lógica de negocio.

## F) Filtros y Paginación

- **Búsqueda**: Implementada en el reporte de libros más prestados (por título/autor) usando parámetros de consulta seguros.
- **Paginación**: Implementada en el servidor para manejar grandes volúmenes de datos eficientemente en los reportes de libros y actividad de socios.



> [!IMPORTANT]
> Los archivos SQL en `db/` están numerados (`01_`, `02_`, etc.) para garantizar que Docker los ejecute en el orden correcto (Esquema -> Seed -> Vistas -> Índices -> Roles).

