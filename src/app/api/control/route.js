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

// Function to handle POST request
export async function POST(request) {
  try {
    const data = await request.json();
    const { led2 } = data;

    if (led2 === undefined) {
      return new Response(JSON.stringify({ error: "LED2 status not provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Update LED2 status in the database
    await client.query('UPDATE "BO013" SET "led2" = $1 WHERE id = 1', [led2]); // Adjust the query based on your table structure

    return new Response(JSON.stringify({ message: "LED2 status updated successfully" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
