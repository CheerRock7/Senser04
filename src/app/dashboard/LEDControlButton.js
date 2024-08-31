// src/app/component/LEDControl.js
'use client';
import { useState, useEffect } from 'react';


const LEDControlButton = () => {
    const [ledStatus, setLedStatus] = useState(false);
    const [loading, setLoading] = useState(false);

    // Function to fetch initial LED status from API
    useEffect(() => {
        const fetchLedStatus = async () => {
            try {
                const response = await fetch('/api/LEDcontrol');
                const data = await response.json();
                if (data.success) {
                    setLedStatus(data.status);
                } else {
                    console.error('Error fetching LED status:', data.error);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchLedStatus();
    }, []);

    const toggleLed = async () => {
        setLoading(true);
        const action = ledStatus ? 'off' : 'on';

        try {
            const response = await fetch('/api/LEDcontrol', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ action }),
            });

            const data = await response.json();
            if (data.success) {
                setLedStatus(!ledStatus);
            } else {
                console.error('Error updating LED status:', data.error);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center mb-4">
            <button
                onClick={toggleLed}
                disabled={loading}
                className={`btn ${loading ? 'btn-secondary' : ledStatus ? 'btn-danger' : 'btn-success'} me-2`}
            >
                {loading ? 'Processing...' : ledStatus ? 'Off' : 'On'}
            </button>
        </div>
    );
};

export default LEDControlButton;