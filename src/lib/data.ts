import pool from './db';
import { z } from 'zod';
import { unstable_noStore as noStore } from 'next/cache';

// --- Type Definitions ---

export interface MostBorrowedBook {
    libro_id: number;
    titulo: string;
    autor: string;
    categoria: string;
    total_prestamos: number;
    ranking_prestamos: number;
}

export interface OverdueLoan {
    prestamo_id: number;
    socio: string;
    libro: string;
    fecha_prestamo: Date;
    fecha_vencimiento: Date;
    dias_atraso: number;
    monto_sugerido: number;
}

export interface FinesSummary {
    mes: Date;
    total_multas: number;
    monto_pagado: number;
    monto_pendiente: number;
}

export interface MemberActivity {
    socio_id: number;
    socio: string;
    tipo_socio: string;
    total_prestamos: number;
    prestamos_vencidos: number;
    tasa_atraso: number;
}

export interface InventoryHealth {
    categoria: string;
    total_ejemplares: number;
    ejemplares_disponibles: number;
    ejemplares_prestados: number;
    ejemplares_perdidos: number;
    porcentaje_disponibles: number;
}

// --- Validation Schemas ---

const PaginationSchema = z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
});

const SearchSchema = z.string().optional();

// --- DAO Functions ---

export async function getMostBorrowedBooks(page: number = 1, limit: number = 10, search?: string) {
    noStore();
    const offset = (page - 1) * limit;
    let query = 'SELECT * FROM vw_most_borrowed_books';
    const params: (string | number)[] = [limit, offset];
    let paramIndex = 3;

    if (search) {
        query += ` WHERE titulo ILIKE $${paramIndex} OR autor ILIKE $${paramIndex}`;
        params.push(`%${search}%`);
    }

    query += ' ORDER BY ranking_prestamos ASC LIMIT $1 OFFSET $2';

    const result = await pool.query<MostBorrowedBook>(query, params);

    // Get total count for pagination metadata
    let countQuery = 'SELECT COUNT(*) FROM vw_most_borrowed_books';
    const countParams: (string | number)[] = [];
    if (search) {
        countQuery += ' WHERE titulo ILIKE $1 OR autor ILIKE $1';
        countParams.push(`%${search}%`);
    }
    const countResult = await pool.query(countQuery, countParams);

    return {
        data: result.rows,
        metadata: {
            total: parseInt(countResult.rows[0].count),
            page,
            limit,
            totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit)
        }
    };
}

export async function getOverdueLoans(page: number = 1, limit: number = 10, minDaysOverdue?: number) {
    noStore();
    const offset = (page - 1) * limit;
    let query = 'SELECT * FROM vw_overdue_loans';
    const params: (number)[] = [limit, offset];

    if (minDaysOverdue !== undefined) {
        query += ` WHERE dias_atraso >= $3`;
        params.push(minDaysOverdue);
    }

    query += ' ORDER BY dias_atraso DESC LIMIT $1 OFFSET $2';

    const result = await pool.query<OverdueLoan>(query, params);

    // Count
    let countQuery = 'SELECT COUNT(*) FROM vw_overdue_loans';
    const countParams: number[] = [];
    if (minDaysOverdue !== undefined) {
        countQuery += ' WHERE dias_atraso >= $1';
        countParams.push(minDaysOverdue);
    }
    const countResult = await pool.query(countQuery, countParams);

    return {
        data: result.rows,
        metadata: {
            total: parseInt(countResult.rows[0].count),
            page,
            limit,
            totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit)
        }
    };
}

export async function getFinesSummary() {
    noStore();
    const result = await pool.query<FinesSummary>('SELECT * FROM vw_fines_summary ORDER BY mes DESC');
    return result.rows;
}

export async function getMemberActivity(page: number = 1, limit: number = 10, minOverdueRate?: number) {
    noStore();
    const offset = (page - 1) * limit;
    let query = 'SELECT * FROM vw_member_activity';
    const params: (number)[] = [limit, offset];

    if (minOverdueRate !== undefined) {
        query += ' WHERE tasa_atraso >= $3';
        params.push(minOverdueRate);
    }

    query += ' ORDER BY total_prestamos DESC LIMIT $1 OFFSET $2';

    const result = await pool.query<MemberActivity>(query, params);

    let countQuery = 'SELECT COUNT(*) FROM vw_member_activity';
    const countParams = [];
    if (minOverdueRate !== undefined) {
        countQuery += ' WHERE tasa_atraso >= $1';
        countParams.push(minOverdueRate);
    }
    const countResult = await pool.query(countQuery, countParams);

    return {
        data: result.rows,
        metadata: {
            total: parseInt(countResult.rows[0].count),
            page,
            limit,
            totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit)
        }
    };
}

export async function getInventoryHealth() {
    noStore();
    const result = await pool.query<InventoryHealth>('SELECT * FROM vw_inventory_health ORDER BY porcentaje_disponibles');
    return result.rows;
}
