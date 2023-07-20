import axios from "axios";

export default async (req, res) => {
    res.setHeader('Access-Control-Allow-Credentials', true)
    res.setHeader('Access-Control-Allow-Origin', '*')
    // then check if only GET method is allowed
    if (req.method === 'OPTIONS') {
        res.status(200).end()
        return
    }
    const {
        query: { lat, lon },
    } = req
    console.log("/api/weather/coordinates: ");
    console.log(`lat : ${lat}`);
    console.log(`lon : ${lon}`);
    const geoApi = process.env.APIGEO;
    const weatherApi = process.env.OPENWEATHERAPI;
    const units = 'metric';
    let cityName;
    const getCityName = async (lat, lon) => {
        const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${geoApi}`;
        console.log(`GETCITYNAME: lat ${lat}, lon ${lon}`); // add this line
        try {
            const response = await axios.get(url);
            return response.data.results[0].components.city;
        } catch (error) {
            console.error(`Error: ${error}`);
        }
    };
    async function getCityCoordinates() {
        const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=${units}&appid=${weatherApi}`;

        try {
            const response = await axios.get(url);

            const weatherData = {
                cityName: await getCityName(lat, lon),
                weather: response.data
            };

            res.json(weatherData);
            console.log(`WEATHER DATA: ${weatherData}`);
        } catch (error) {
            console.error(`Error: ${error}`);
            res.status(500).json({ message: 'Server error' });
        }
    }
    await getCityCoordinates();
}
