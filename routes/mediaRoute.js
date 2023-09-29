const mediaController = require('../controllers/mediaController')
const router = require('express').Router()
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('mediaImage'), mediaController.createMedia)
router.get('/', mediaController.getAllMedia)
router.get('/latest', mediaController.getLatestMedia)

router.get('/:id', mediaController.getOneMedia)
router.put('/:id', upload.single('mediaImage'), mediaController.updateMedia)
router.delete('/:id', mediaController.deleteMedia)

module.exports = router