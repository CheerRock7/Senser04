"use client";

import { useEffect, useState } from 'react';

export default function Dashboard() {
    const [data, setData] = useState({ ultrasonic: 'Loading...', buzzer: 'Loading...', led: 'Loading...' });

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('/api/getdata');
                const result = await response.json();
                setData(result);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchData();
    }, []);

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1>Dashboard</h1>
            </header>
            <main style={styles.main}>
                <div style={styles.card}>
                    <h2 style={styles.cardTitle}>Ultrasonic Sensor</h2>
                    <p style={styles.cardContent}>{data.ultrasonic} cm</p>
                </div>
                <div style={styles.card}>
                    <h2 style={styles.cardTitle}>Buzzer Status</h2>
                    <p style={styles.cardContent}>{data.buzzer ? 'On' : 'Off'}</p>
                </div>
                <div style={styles.card}>
                    <h2 style={styles.cardTitle}>LED Status</h2>
                    <p style={styles.cardContent}>{data.led ? 'On' : 'Off'}</p>
                </div>
            </main>
        </div>
    );
}

const styles = {
    container: {
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f4f4f4',
        padding: '20px',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    header: {
        backgroundColor: '#4CAF50',
        color: '#fff',
        padding: '20px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        marginBottom: '20px',
    },
    main: {
        width: '100%',
        maxWidth: '800px',
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '20px',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        padding: '20px',
        textAlign: 'center',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: '0 8px 12px rgba(0, 0, 0, 0.2)',
        }
    },
    cardTitle: {
        fontSize: '1.5em',
        margin: '0 0 10px 0',
    },
    cardContent: {
        fontSize: '1.2em',
        margin: '0',
        color: '#333',
    },
};
