const productController = require('../controllers/productController')
const router = require('express').Router()
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('image'), productController.createProduct)
router.get('/', productController.getAllProducts)
router.get('/category/:productCategory', productController.getProductByCategory)

router.get('/:id', productController.getOneProduct)
router.put('/:id', upload.single('image'), productController.updateProduct)
router.delete('/:id', productController.deleteProduct)

module.exports = router