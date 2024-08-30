const express = require('express');
const path = require('path');
const { Client } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Initialize PostgreSQL client
const client = new Client({
    connectionString: process.env.DATABASE_URL,
});

client.connect().catch((err) => {
    console.error("Database connection error:", err.message);
});

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, '../public')));

// Define routes
app.get('/api/getdata', async (req, res) => {
    try {
        const result = await client.query('SELECT ultrasonic, buzzer, led FROM "BO013" WHERE id = 1');
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "No data found" });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error fetching data:", error.message);
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
