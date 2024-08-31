"use client";

import { useEffect, useState } from 'react';
import LEDControlButton from './LEDControlButton';
//import ledonoff from "./LEDControlButton";

const styles = {
    main: {
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f4f4f4',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        margin: '20px',
        padding: '20px',
        textAlign: 'center',
        width: '300px',
    },
    cardTitle: {
        fontSize: '1.5rem',
        color: '#333',
    },
    cardContent: {
        fontSize: '1.2rem',
        color: '#555',
    }
};

export default function Dashboard() {
    const [data, setData] = useState({ ultrasonic: 'Loading...', buzzer: 'Loading...', led: 'Loading...' });

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('/api/control'); // Update the URL if necessary
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const result = await response.json();
                console.log(result)
                
                // Check if result is an array and has at least one item
                if (Array.isArray(result) && result.length > 0) {
                    const firstItem = result[0];
                    setData({
                        ultrasonic: firstItem.ultrasonic,
                        buzzer: firstItem.buzzer,
                        led: firstItem.led,
                    });
                } else {
                    setData({
                        ultrasonic: 'No Data',
                        buzzer: 'No Data',
                        led: 'No Data',
                    });
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setData({
                    ultrasonic: 'Error',
                    buzzer: 'Error',
                    led: 'Error',
                });
            }
        }
        

        fetchData();
        const intervalId = setInterval(fetchData, 5000);

        // Clear interval on component unmount
        return () => clearInterval(intervalId);
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
                <p style={styles.cardContent}>{data.buzzer === '1' ? 'On' : 'Off'}</p>
            </div>
            <div style={styles.card}>
                <h2 style={styles.cardTitle}>LED Status</h2>
                <p style={styles.cardContent}>{data.led === '1' ? 'On' : 'Off'}</p>
            </div>
            <div style={styles.card}>
                <h2 style={styles.cardTitle}>LED Status</h2>
                <LEDControlButton/>
            </div>
        </main>
        </div>
    );
}


