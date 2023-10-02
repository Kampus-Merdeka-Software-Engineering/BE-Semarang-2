const reviewController = require('../controllers/reviewController')
const router = require('express').Router()
const sanitizeHtml = require('sanitize-html');

/* Middleware to sanitize user input */
const sanitizeUserInput = (req, res, next) => {
    for (const key in req.body) {
        if (req.body.hasOwnProperty(key)) {
            req.body[key] = sanitizeHtml(req.body[key]);
        }
    }
    next();
}

router.get('/analyze-reviews', reviewController.getReviews)

router.post('/', reviewController.validateEmailReview, sanitizeUserInput, reviewController.createReview)
router.get('/', reviewController.getAllReview)

router.get('/:id', reviewController.getOneReview)
router.put('/:id', reviewController.validateEmailReview, sanitizeUserInput, reviewController.updateReview)
router.delete('/:id', reviewController.deleteReview)

module.exports = router;