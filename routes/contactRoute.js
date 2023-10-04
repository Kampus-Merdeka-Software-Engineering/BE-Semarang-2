const contactController = require('../controllers/contactController')
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

router.post('/', contactController.validateContact, sanitizeUserInput, contactController.createContact)
router.get('/', contactController.getAllContacts)

router.get('/:id', contactController.getOneContact)
router.put('/:id', contactController.validateContact, sanitizeUserInput, contactController.updateContact)
router.delete('/:id', contactController.deleteContact)

module.exports = router