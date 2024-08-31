// src/app/api/route.js
import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});
client.connect();

export const dynamic = 'force-dynamic';

// Function to handle GET request
export async function GET() {
  try {
    const result = await client.query('SELECT * FROM "BO013"');
    return new Response(JSON.stringify(result.rows), {
      status: 200,
      headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}