// app/api/LEDcontrol/route.js
import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// ตั้งค่าการเชื่อมต่อกับ PostgreSQL
const client = new Client({
    connectionString: process.env.DATABASE_URL,
});

client.connect();

const handleError = (error) => {
    console.error('Database error:', error);
    return new Response(JSON.stringify({ success: false, error: 'Internal Server Error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
    });
};

export async function GET() {
    try {
        const result = await client.query('SELECT status FROM boled013 WHERE pin = $1', [15]);
        if (result.rowCount === 0) {
            return new Response(JSON.stringify({ success: false, error: 'No data found for the specified pin' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        const status = result.rows[0]?.status ?? false;
        return new Response(JSON.stringify({ success: true, status }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return handleError(error);
    }
}

export async function POST(request) {
    try {
        const { action } = await request.json();
        if (typeof action !== 'string') {
            return new Response(JSON.stringify({ success: false, error: 'Invalid request payload' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        const status = action === 'on';

        const result = await client.query('UPDATE boled013 SET status = $1 WHERE pin = $2 RETURNING *', [status, 15]);

        if (result.rowCount === 0) {
            return new Response(JSON.stringify({ success: false, error: 'Failed to update LED status' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return handleError(error);
    }
}

async function initializeDatabase() {
    try {
        const result = await client.query('SELECT * FROM boled013 WHERE pin = $1', [15]);
        if (result.rowCount === 0) {
            await client.query('INSERT INTO boled013 (pin, status) VALUES ($1, $2)', [15, false]);
            console.log('Initialized pin 19 with status false.');
        }
    } catch (error) {
        console.error('Error during database initialization:', error);
    }
}

// Call this function during your server startup
initializeDatabase();