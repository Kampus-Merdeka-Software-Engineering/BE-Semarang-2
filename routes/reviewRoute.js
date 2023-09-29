const reviewController = require('../controllers/reviewController')
const router = require('express').Router()

router.get('/analyze-reviews', reviewController.getReviews)

router.post('/', reviewController.validateEmailReview, reviewController.createReview)
router.get('/', reviewController.getAllReview)

router.get('/:id', reviewController.getOneReview)
router.put('/:id', reviewController.validateEmailReview, reviewController.updateReview)
router.delete('/:id', reviewController.deleteReview)

module.exports = router;