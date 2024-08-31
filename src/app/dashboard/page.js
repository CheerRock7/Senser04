"use client";

import { useEffect, useState } from 'react';

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
    },
    button: {
        padding: '10px 20px',
        fontSize: '1rem',
        color: '#fff',
        backgroundColor: '#007BFF',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        marginTop: '10px',
    },
    buttonOff: {
        backgroundColor: '#6c757d',
    },
};

export default function Dashboard() {
    const [data, setData] = useState({
        ultrasonic: 'Loading...',
        buzzer: 'Loading...',
        led: 'Loading...',
        led2: 'Loading...', // Add state for LED2
    });

    const [led2Status, setLed2Status] = useState('0'); // LED2 initial status

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('/api/control'); // Update the URL if necessary
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const result = await response.json();
                console.log(result);
                
                if (Array.isArray(result) && result.length > 0) {
                    const firstItem = result[0];
                    setData({
                        ultrasonic: firstItem.ultrasonic,
                        buzzer: firstItem.buzzer,
                        led1: firstItem.led,
                        led2: firstItem.led2, // Update LED2 status
                    });
                    setLed2Status(firstItem.led2); // Set LED2 status
                } else {
                    setData({
                        ultrasonic: 'No Data',
                        buzzer: 'No Data',
                        led1: 'No Data',
                        led2: 'No Data',
                    });
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setData({
                    ultrasonic: 'Error',
                    buzzer: 'Error',
                    led: 'Error',
                    led2: 'Error',
                });
            }
        }
        
        fetchData();
        const intervalId = setInterval(fetchData, 5000);

        return () => clearInterval(intervalId);
    }, []);

    async function handleLed2Toggle() {
        try {
            const newStatus = led2Status === '1' ? '0' : '1';
            const response = await fetch('/api/control', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ led2: newStatus }),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const result = await response.json();
            console.log(result);
            setLed2Status(newStatus); // Update local LED2 status
        } catch (error) {
            console.error('Error updating LED2 status:', error);
        }
    }

    return (
        <div style={styles.main}>
            <header>
                <h1>Dashboard</h1>
            </header>
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
                <h2 style={styles.cardTitle}>LED2 Status</h2>
                <p style={styles.cardContent}>{led2Status === '1' ? 'On' : 'Off'}</p>
                <button 
                    style={{ ...styles.button, ...(led2Status === '1' ? styles.buttonOff : {}) }} 
                    onClick={handleLed2Toggle}
                >
                    {led2Status === '1' ? 'Turn Off LED2' : 'Turn On LED2'}
                </button>
            </div>
        </div>
    );
}
