const newsletterController = require('../controllers/newsletterController')
const router = require('express').Router()
const sanitizeHtml = require('sanitize-html');
const rateLimit = require('express-rate-limit');

// Konfigurasi Rate Limiting
const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // Maximum 10 requests per time window
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

router.post('/', limiter, newsletterController.validateNewsletter, sanitizeUserInput, newsletterController.createNewsletter)
router.get('/', newsletterController.getAllNewsletters)

router.get('/:id', newsletterController.getOneNewsletter)
router.put('/:id', newsletterController.validateNewsletter, sanitizeUserInput, newsletterController.updateNewsletter)
router.delete('/:id', newsletterController.deleteNewsletter)

module.exports = router