const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors')
const helmet = require('helmet');
const app = express()
const { body, validationResult, check } = require("express-validator");
const cookieParser = require('cookie-parser')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '/', '.env') })

/* Middleware */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});

/* Routers API */
const routerNewsletter = require('./routes/newsletterRoute')

app.use('/api/newsletters', routerNewsletter)

/* ENDPOINTS */
/* Endpoint Home */
app.get('/', (req, res) => {
    return res.status(200).json({ message: 'This is the main menu' });
})

/* Endpoint Product */
app.get('/product', (req, res) => {
    return res.status(200).json({ message: 'This is the product menu' });
})

/* Endpoint About */
app.get('/about', (req, res) => {
    return res.status(200).json({ message: 'This is the about us menu' });
})

/* Endpoint Contact */
app.get('/contact', (req, res) => {
    return res.status(200).json({ message: 'This is the contact us menu' });
})

/* Server */
app.listen(process.env.PORT, () => {
    console.log("Express server listening on %d in %s mode", process.env.PORT, app.settings.env)
})