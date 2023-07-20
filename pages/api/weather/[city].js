import axios from "axios";

export default async (req, res) => {
    const {
        query: { city },
    } = req
    const geoApi = process.env.APIGEO;
    const weatherApi = process.env.OPENWEATHERAPI;
    console.log(city);
    async function getCityCoordinates(city) {
        const url = `https://api.opencagedata.com/geocode/v1/json?q=${city}&key=${geoApi}`;

        try {
            const response = await axios.get(url);
            return response.data.results[0].geometry;
        } catch (error) {
            console.error(`Error: ${error}`);
            res.status(500).send(`Error retrieving city coordinates: ${error}`);
        }
    }

    const coordinates = await getCityCoordinates(city);

    if (coordinates.lat && coordinates.lng) {
        const units = 'metric';
        const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${coordinates.lat}&lon=${coordinates.lng}&units=${units}&appid=${weatherApi}`;
        axios.get(url)
            .then(response => {
                res.json({ weather: response.data , cityName: city});
            })
            .catch(error => {
                console.error(`Error: ${error}`);
                res.status(500).send(`Error retrieving weather data: ${error}`);
            });
    } else {
        res.status(500).send('Error retrieving city coordinates');
    }
}
