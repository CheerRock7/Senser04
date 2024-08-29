//src/app/api/route.js
import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config();
const client = new Client({
  connectionString: process.env.DATABASE_URL,
});
client.connect();
export async function GET() {
    try {
      const result = await client.query('SELECT * FROM "BO013"');
      //return new Response(JSON.stringify({ message: "GET DATA OK"}), {
        return new Response(JSON.stringify(result.rows), {
        status: 200,
        headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: "Internal Server Error" }), {
        status: 500,
        headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" },
      });
    }
  }

  export async function POST(request) {
    try {
    const { id, LED_stats, HCRS04, System_stats } = await request.json();
    // Hash password
    const res = await client.query('INSERT INTO "BO013" (id, LED_stats, HCRS04, System_stats) VALUES ($1, $2, $3, $4) RETURNING *', [id, LED_stats, HCRS04, System_stats]);
    return new Response(JSON.stringify(res.rows[0]), {
    status: 201,
    headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" },
    });
    } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
    status: 500,
    headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" },
    });
    }
    }