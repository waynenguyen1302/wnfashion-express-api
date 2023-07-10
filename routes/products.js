const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { isAuthenticated, isAdmin } = require('../middlewares/authMiddleware');



// GET /products
router.get('/', productController.getAllProducts);

//GET product by category
router.get('/filter', productController.getProductsByCategory);

//GET product by sub category
router.get('/subcategories-filter', productController.getProductsBySubcategories);

// GET /products/:id
router.get('/:id', productController.getProductById);

// POST /products
router.post('/add', productController.createProduct);

// PUT /products/:id
router.put('/edit/:id', productController.editProduct);

// DELETE /products/:id
router.delete('/delete/:id', productController.deleteProduct);



module.exports = router;
