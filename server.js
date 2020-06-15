const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const port = 3000;
const path = require('path');
const bodyParser = require('body-parser');
const axios = require('axios');
app.use(bodyParser.urlencoded({
    extended: false
}));

const publicPath = path.join(__dirname, "/public");
app.use(express.static(publicPath));
app.use(express.json());
app.engine('handlebars', exphbs({
    defaultLayout: 'layout'
}));
app.set('view engine', 'handlebars');

app.get('/', (req, res) => res.render('index', {
    title: 'home'
}));

app.post('/weather', async(req, res) => {
    try {
        const API_KEY = require('./sources/keys.json').API_KEY;
        const cityName = req.body.cityName;
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&APPID=${API_KEY}&units=metric`;
        const dataFetched = await axios.get(weatherUrl);
        const temperature = dataFetched.data.main.temp;
        res.render('cityWeather', {
            cityName,
            temperature
        });
    } catch (error) {
        res.render('index', {
            errorMessage: 'City is not found!'
        });
    }
});

app.listen(port, () => console.log(`Example app listening at:${port}`));