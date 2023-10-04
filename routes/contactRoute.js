const contactController = require('../controllers/contactController')
const router = require('express').Router()
const sanitizeHtml = require('sanitize-html');
const rateLimit = require('express-rate-limit');

/* Konfigurasi Rate Limiting */
const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // Maximum 2 requests per time window
    message: 'Too many requests from this IP address, please try again later.',
});

/* Middleware to sanitize user input */
const sanitizeUserInput = (req, res, next) => {
    for (const key in req.body) {
        if (req.body.hasOwnProperty(key)) {
            req.body[key] = sanitizeHtml(req.body[key]);
        }
    }
    next();
}

router.post('/', limiter, contactController.validateContact, sanitizeUserInput, contactController.createContact)
router.get('/', contactController.getAllContacts)

router.get('/:id', contactController.getOneContact)
router.put('/:id', contactController.validateContact, sanitizeUserInput, contactController.updateContact)
router.delete('/:id', contactController.deleteContact)

module.exports = router