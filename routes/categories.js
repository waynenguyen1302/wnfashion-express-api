const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// GET /categories
router.get('/', categoryController.getAllCategories);

// GET /categories/:id
router.get('/:id', categoryController.getCategoryById);

// POST /categories
router.post('/add', categoryController.createCategory);

// PUT /categories/:id
router.put('/edit/:id', categoryController.updateCategory);

// DELETE /categories/:id
router.delete('/delete/:id', categoryController.deleteCategory);

module.exports = router;