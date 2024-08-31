"use client";

import { useEffect, useState } from 'react';
import LEDControlButton from './LEDControlButton';
import 'bootstrap/dist/css/bootstrap.min.css';

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
                console.log(result);
                
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
        <div className="container mt-5">
            <header className="text-center mb-4">
                <h1 className="display-4">Dashboard</h1>
            </header>
            <main className="d-flex flex-column align-items-center">
                <div className="card mb-4 shadow-lg border-0" style={{ width: '100%', maxWidth: '400px' }}>
                    <div className="card-body text-center">
                        <h5 className="card-title">Ultrasonic Sensor</h5>
                        <p className="card-text fs-5">{data.ultrasonic} cm</p>
                    </div>
                </div>
                <div className="card mb-4 shadow-lg border-0" style={{ width: '100%', maxWidth: '400px' }}>
                    <div className="card-body text-center">
                        <h5 className="card-title">Buzzer Status</h5>
                        <p className="card-text fs-5">{data.buzzer === '1' ? 'On' : 'Off'}</p>
                    </div>
                </div>
                <div className="card mb-4 shadow-lg border-0" style={{ width: '100%', maxWidth: '400px' }}>
                    <div className="card-body text-center">
                        <h5 className="card-title">LED Status</h5>
                        <p className="card-text fs-5">{data.led === '1' ? 'On' : 'Off'}</p>
                    </div>
                </div>
                <div className="card mb-4 shadow-lg border-0" style={{ width: '100%', maxWidth: '400px' }}>
                    <div className="card-body text-center">
                        <h5 className="card-title">System Status</h5>
                        <LEDControlButton />
                    </div>
                </div>
            </main>
        </div>
    );
}
