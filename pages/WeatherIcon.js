import React from 'react';
import 'weather-icons/css/weather-icons.css';

function WeatherIcon() {
    const spinAnimation = {
        animation: 'spin 2s linear infinite',
        '@keyframes spin': {
            '0%': { transform: 'rotate(0deg)' },
            '100%': { transform: 'rotate(360deg)' }
        }
    };

    return <i className="wi wi-day-sunny" style={spinAnimation}></i>;
}

export default WeatherIcon;