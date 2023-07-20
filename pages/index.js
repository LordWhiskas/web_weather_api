import React, { useState, useEffect } from 'react';
import { Box, Button, Card, CardContent, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import SearchIcon from '@mui/icons-material/Search';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import styles from '../Weather.module.css'; // Импортировать CSS файл
import MatrixEffect from './MatrixEffect';
import 'weather-icons/css/weather-icons.css';
const CustomInputComponent = ({ inputRef, ...rest }) => (
    <input
        ref={inputRef}
        {...rest}
        type="text"
        style={{ color: 'white' }}
    />
);
const NUM_DROPS = 100; // Количество капель. Измените это число в соответствии с вашими потребностями.
function Weather() {
    const apiKey = "38103413-1fdb12fe9818011ba12e26320&q";
    const [isBoxVisible, setBoxVisible] = useState(false);
    const [weather, setWeather] = useState(null);
    const [city, setCity] = useState(null);
    const [backgroundImage, setBackgroundImage] = useState(null);
    const [enteredCity, setEnteredCity] = useState(""); // новое состояние для введенного города
    const [loadingImage, setLoadingImage] = useState(false); // состояние для отслеживания загрузки фотографии
    const date = new Date();
    const [currentImageInfo, setCurrentImageInfo] = useState(null); // добавлено
    const [icon, setIcon] = useState(null);
    const canvasRef = React.useRef(null);
    const [days, setDays] = useState(null);
    const handleInputChange = (event) => {
        setEnteredCity(event.target.value); // обновляем состояние при вводе

    };
    const setWeatherIcon = (currentCondition) =>{
        console.log(`setWeatherIcon: ${currentCondition}`);
        if (currentCondition === "Clear"){
            setIcon("data:image/png;base64,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");
        }
        else if (currentCondition === "Clouds"){
            setIcon("data:image/png;base64,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");
        }
        else if (currentCondition === "Snow"){
            setIcon("data:image/png;base64,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");
        }
        else if (currentCondition === "Rain"){
            setIcon("data:image/png;base64,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");
        }
        else {
            setIcon(null);
        }
    };
    const fetchWeatherData = () => {
        axios.get(`/api/weather/${enteredCity}`) // отправляем запрос с именем города
            .then((response) => {
                // обновляем состояние данными о погоде и городе
                setWeather(response.data.weather);
                console.log(response.data.weather);
                setCity(response.data.cityName);
                console.log(`response: ${response.data.weather.current.weather[0].description}`);
                setWeatherIcon(response.data.weather.current.weather[0].main);
                fetchPixabay(response.data.cityName);

                /*const timestamp = response.data.weather.daily[1].dt; // Значение dt из элемента с индексом 0
                const date = new Date(timestamp * 1000); // Умножаем на 1000, так как JavaScript работает с миллисекундами

                const options = { weekday: 'long' };
                const dayOfWeek = date.toLocaleString('en-US', options); // Получаем название дня недели на английском языке*/
                const daysArrayTemp = [];
                for (let i = 0; i <= 6; i++){
                    const timestamp = response.data.weather.daily[i + 1].dt;
                    const date = new Date(timestamp * 1000);
                    const options = {weekday: 'long'};
                    const dayOfWeek = date.toLocaleString('en-US', options);
                    daysArrayTemp.push(dayOfWeek);
                }
                console.log(daysArrayTemp);
                setDays(daysArrayTemp);
            })
            .catch((error) => {
                console.error(error);
            });
    };
    useEffect(() => {
        setBoxVisible(true);
    }, []);

    const fetchPixabay = (cityName) => {
        setLoadingImage(true);
        console.log("pixabay");
        console.log(`${apiKey} ${cityName}`);
        fetch(`https://pixabay.com/api/?key=${apiKey}=${encodeURIComponent(cityName)}+city&image_type=photo`)
            .then(res => res.json())
            .then(data => {
                if (data.hits && data.hits.length > 0) {
                    const randomIndex = Math.floor(Math.random() * data.hits.length);
                    const imageUrl = data.hits[randomIndex].largeImageURL;
                    const imageInfo = data.hits[randomIndex]; // сохраняем информацию об изображении

                    // Добавляем случайный параметр запроса к URL изображения
                    const imageUrlWithCacheBuster = `${imageUrl}?${uuidv4()}`;

                    setBackgroundImage(imageUrlWithCacheBuster);
                    setCurrentImageInfo(imageInfo); // обновляем информацию об изображении
                } else {
                    // Если результаты не найдены, делаем запрос без "+city"
                    fetch(`https://pixabay.com/api/?key=38103413-1fdb12fe9818011ba12e26320&q=${encodeURIComponent(cityName)}&image_type=photo`)
                        .then(res => res.json())
                        .then(data => {
                            if (data.hits && data.hits.length > 0) {
                                const randomIndex = Math.floor(Math.random() * data.hits.length);
                                const imageUrl = data.hits[randomIndex].largeImageURL;
                                const imageInfo = data.hits[randomIndex]; // сохраняем информацию об изображении

                                // Добавляем случайный параметр запроса к URL изображения
                                const imageUrlWithCacheBuster = `${imageUrl}?${uuidv4()}`;

                                setBackgroundImage(imageUrlWithCacheBuster);
                                setCurrentImageInfo(imageInfo); // обновляем информацию об изображении
                            }
                        });
                }
            });
        setTimeout(() => {
            setLoadingImage(false);
        }, 1000);
    }

    const fetchCurrentLocation = () => {
        console.log("fetchCurrentLocation");
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                const lon = position.coords.longitude;
                const lat = position.coords.latitude;

                axios.get(`/api/weather/coordinates?lat=${lat}&lon=${lon}`) // отправляем запрос с координатами
                    .then((response) => {
                        setWeather(response.data.weather);
                        setCity(response.data.cityName);
                        console.log(response.data.weather.current);
                        const daysArrayTemp = [];
                        for (let i = 0; i <= 6; i++){
                            const timestamp = response.data.weather.daily[i + 1].dt;
                            const date = new Date(timestamp * 1000);
                            const options = {weekday: 'long'};
                            const dayOfWeek = date.toLocaleString('en-US', options);
                            daysArrayTemp.push(dayOfWeek);
                        }
                        console.log(daysArrayTemp);
                        setDays(daysArrayTemp);
                        setWeatherIcon(response.data.weather.current.weather[0].main);
                        fetchPixabay(response.data.cityName);
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }, function (error) {
                console.error("Error occurred while getting location", error);
            });
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    };


    return (
        <div className={`${styles.root} ${isBoxVisible ? styles.fadeIn : ''}`}>

            <div className={styles.fadeIn}>{loadingImage && <MatrixEffect />}</div>
            {!loadingImage && <div className={`${styles.tvEffect} ${styles.fadeIn}`} style={{backgroundImage: `url(${backgroundImage})`}}></div>}
            <div className={styles.greenOverlay}></div>
            <div className={styles.columnContainer}>
                {weather ? (
                    <div className={styles.card}>
                        <label htmlFor="cityName" className={`${styles.matrixText} ${styles.textRoot}`}>Enter City Name</label>
                        <TextField
                            id="cityName"
                            value={enteredCity}
                            onChange={handleInputChange}
                            className={styles.textField}
                            variant="standard"
                            color="success"
                            focused
                            InputProps={{
                                inputComponent: CustomInputComponent
                            }}
                        />
                        <button onClick={fetchWeatherData} className={styles.searchButton}>
                            <SearchIcon/> Search
                        </button>
                        <button onClick={fetchCurrentLocation} className={styles.searchButton}>
                            <MyLocationIcon/> Detect Location
                        </button>
                        <Typography variant="h4" component="h1" className={styles.matrixText}>
                            <MyLocationIcon/>
                            <span className={styles.cityName}> {city}</span>
                        </Typography>
                        <div className={styles.line}></div>
                        <Typography variant="h6" component="h2" className={styles.matrixText}>
                            <div><img src={icon} alt={weather.current.weather[0].description}/></div>
                            <div><span className={styles.weatherDegrees}>{weather.current.temp}°C</span></div>
                        </Typography>
                        <Typography variant="h5" component="h2" className={styles.matrixText}>
                        <span
                            className={styles.cityName}>{date.getDate() + "."}{date.getMonth() + 1 + "."}{date.getFullYear()}
                        </span>
                            <div className={styles.cityName}>
                                <a  href="https://icons8.com/icon/43612/cloud" >Cloud</a> icon by <a href="https://icons8.com">Icons8</a>
                            </div>
                        </Typography>

                    </div>

                ) : (
                    <Typography variant="h5" component="h2">
                        <button onClick={fetchCurrentLocation} className={styles.firstButton}>
                            <MyLocationIcon/> Detect Location
                        </button>
                    </Typography>
                )}
            </div>
            {weather ? (
                <div className={styles.columnSmallContainer}>
                    <div className={styles.smallCard}>
                        <Typography variant="h5" component="h2" className={styles.weatherDailyDegrees}>
                            <div>
                            <span className={styles.cityName}>
                                {days[0]}
                            </span>
                            </div>
                            <div>
                        <span
                            className={styles.cityName}>{weather.daily[1].temp.day}°C
                        </span>
                            </div>
                        </Typography>
                    </div>
                    <div className={styles.smallCard}>
                        <Typography variant="h5" component="h2" className={styles.weatherDailyDegrees}>
                            <div>
                            <span className={styles.cityName}>
                                {days[1]}
                            </span>
                            </div>
                            <div>
                        <span
                            className={styles.cityName}>{weather.daily[2].temp.day}°C
                        </span>
                            </div>
                        </Typography>
                    </div>
                    <div className={styles.smallCard}>
                        <Typography variant="h5" component="h2" className={styles.weatherDailyDegrees}>
                            <div>
                            <span className={styles.cityName}>
                                {days[2]}
                            </span>
                            </div>
                            <div>
                            <span
                            className={styles.cityName}>{weather.daily[3].temp.day}°C
                            </span>
                            </div>
                        </Typography>
                    </div>
                    <div className={styles.smallCard}>
                        <Typography variant="h5" component="h2" className={styles.weatherDailyDegrees}>
                            <div>
                            <span className={styles.cityName}>
                                {days[3]}
                            </span>
                            </div>
                            <div>
                        <span
                            className={styles.cityName}>{weather.daily[4].temp.day}°C
                        </span>
                            </div>
                        </Typography>
                    </div>
                    <div className={styles.smallCard}>
                        <Typography variant="h5" component="h2" className={styles.weatherDailyDegrees}>
                            <div>
                            <span className={styles.cityName}>
                                {days[4]}
                            </span>
                            </div>
                            <div>
                        <span
                            className={styles.cityName}>{weather.daily[5].temp.day}°C
                        </span>
                            </div>
                        </Typography>
                    </div>
                    <div className={styles.smallCard}>
                        <Typography variant="h5" component="h2" className={styles.weatherDailyDegrees}>
                            <div>
                            <span className={styles.cityName}>
                                {days[5]}
                            </span>
                            </div>
                            <div>
                            <span
                            className={styles.cityName}>{weather.daily[6].temp.day}°C
                        </span>
                            </div>
                        </Typography>
                    </div>

                </div>

            ) :
                (
                    <div>
                <MatrixEffect />
                    </div>
                )}
        </div>
    );


}

export default Weather;
