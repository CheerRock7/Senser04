"use server";
const { Client } = require('pg');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize PostgreSQL client
const client = new Client({
    connectionString: process.env.DATABASE_URL,
});

// Connect to the database
client.connect().catch((err) => {
    console.error("Database connection error:", err.message);
});

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function POST(request) {
    try {
        const requestBody = await request.json(); // Parse the request body as JSON
        const { ultrasonic, buzzer, led } = requestBody;

        // Validate incoming data
        if (typeof ultrasonic === 'undefined' || typeof buzzer === 'undefined' || typeof led === 'undefined') {
            return new Response(JSON.stringify({ error: "Missing required fields" }), {
                status: 400,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        const result = await client.query(
            'UPDATE "BO013" SET ultrasonic = $1, buzzer = $2, led = $3 WHERE id = 1',
            [ultrasonic, buzzer, led]
        );

        return new Response(JSON.stringify({ message: "Update successful" }), {
            status: 200,
            headers: {
                ...corsHeaders,
                "Content-Type": "application/json",
                "Cache-Control": "no-cache"
            },
        });
    } catch (error) {
        console.error("Error updating data:", error.message);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
}
