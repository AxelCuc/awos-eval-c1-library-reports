-- Create a restricted user for the next.js application
DO
$do$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles
      WHERE  rolname = 'app_user') THEN

      CREATE ROLE app_user WITH LOGIN PASSWORD 'app_password';
   ELSE
      ALTER ROLE app_user WITH PASSWORD 'app_password';
   END IF;
END
$do$;

-- Grant connect to database
GRANT CONNECT ON DATABASE library TO app_user;

-- Grant usage on public schema
GRANT USAGE ON SCHEMA public TO app_user;

-- Revoke all on tables just in case (though default is usually none)
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM app_user;

-- Grant SELECT only on the specific views
GRANT SELECT ON vw_most_borrowed_books TO app_user;
GRANT SELECT ON vw_overdue_loans TO app_user;
GRANT SELECT ON vw_fines_summary TO app_user;
GRANT SELECT ON vw_member_activity TO app_user;
GRANT SELECT ON vw_inventory_health TO app_user;

-- Ensure it cannot create tables
REVOKE CREATE ON SCHEMA public FROM app_user;
