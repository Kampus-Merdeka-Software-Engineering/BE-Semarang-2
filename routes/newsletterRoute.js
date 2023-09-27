const newsletterController = require('../controllers/newsletterController')
const router = require('express').Router()

router.post('/', newsletterController.validateNewsletter, newsletterController.createNewsletter)
router.get('/', newsletterController.getAllNewsletters)

router.get('/:id', newsletterController.getOneNewsletter)
router.put('/:id', newsletterController.validateNewsletter, newsletterController.updateNewsletter)
router.delete('/:id', newsletterController.deleteNewsletter)

module.exports = router