const contactController = require('../controllers/contactController')
const router = require('express').Router()

router.post('/', contactController.validateContact, contactController.createContact)
router.get('/', contactController.getAllContacts)

router.get('/:id', contactController.getOneContact)
router.put('/:id', contactController.validateContact, contactController.updateContact)
router.delete('/:id', contactController.deleteContact)

module.exports = router