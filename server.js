const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors')
const helmet = require('helmet');
const app = express()
const { body, validationResult, check } = require("express-validator");
const morgan = require('morgan')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '/', '.env') })

const corsOptions = {
    origin: ['https://kampus-merdeka-software-engineering.github.io', 'http://127.0.0.1:5500'],
    methods: 'GET,POST',
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
    allowedHeaders: 'Content-Type',
};

/* Middleware */
app.use(cors(corsOptions))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('combined'))

app.use([
    body('firstName').escape(),
    body('lastName').escape(),
    body('email').escape(),
    body('noHp').escape(),
    body('message').escape(),
    body('emailNewsLetter').escape(),
    body('noHPValue').escape(),
    body('name').escape(),
]);

/* Use CSP */
app.use(helmet());

/* Set Content Security Policy */
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", 'fonts.googleapis.com', 'kit.fontawesome.com', "'unsafe-inline'"],
        fontSrc: ['fonts.gstatic.com', 'ka-f.fontawesome.com'],
        scriptSrc: ["'self'", 'https://kit.fontawesome.com', 'https://unpkg.com'],
        imgSrc: ["'self'", 'www.google.com', 'www.sooribali.com', 'https://unpkg.com'],
        connectSrc: ["'self'", 'fonts.googleapis.com', 'ka-f.fontawesome.com', 'https://unpkg.com'],
        frameSrc: ["'self'", 'https://www.google.com/'],
    }
}));

// app.use(helmet({
//     contentSecurityPolicy: false, // Nonaktifkan default CSP untuk mengaktifkan csrfProtection
//     csrfProtection: true
// }));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});

/* Routers API */
const routerContact = require('./routes/contactRoute')
const routerNewsletter = require('./routes/newsletterRoute')
const routerReview = require('./routes/reviewRoute')
const routerProduct = require('./routes/productRoute')
const routerMedia = require('./routes/mediaRoute');

app.use('/api/contacts', routerContact)
app.use('/api/newsletters', routerNewsletter)
app.use('/api/reviews', routerReview)
app.use('/api/products', routerProduct)
app.use('/api/media', routerMedia);

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