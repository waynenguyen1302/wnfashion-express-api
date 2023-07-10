const Product = require('../models/product');
const Category = require('../models/category');


// Function to update category relationships
async function updateCategoryRelationships(categoryIds, productId, operation) {
  const update = { [operation]: { products: productId } };
  await Category.updateMany({ _id: { $in: categoryIds } }, update);
}


// @route   GET /products
// @desc    Get all products
// @access  Public
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('categories', 'name');
    return res.json(products);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// @route   GET /products/:id
// @desc    Get product by ID
// @access  Public
exports.getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId).populate('categories', 'name');
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    return res.json(product);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// @route   POST /products
// @desc    Create a new product
// @access  Public
exports.createProduct = async (req, res) => {
  try {
    const { name, desc, img, promotion, price, subcategories, categories, type } = req.body;

    const newProduct = new Product({
      name,
      desc,
      img,
      promotion,
      price,
      subcategories,
      categories,
      type
    });

    const createdProduct = await newProduct.save();

    // Add the product to the corresponding categories
    await Category.updateMany({ _id: { $in: categories } }, { $push: { products: createdProduct._id } });

    return res.json(createdProduct);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// @route   PUT /products/:id
// @desc    Update a product
// @access  Public
exports.editProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const { name, price, desc, img, promotion, categories, type} = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { name, price, desc, img, promotion, categories, type },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: error.message });
    }

    // Remove the product from all categories
    await Category.updateMany(
      { products: productId },
      { $pull: { products: productId } }
    );

    // Add the product to the specified categories
    await Category.updateMany(
      { _id: { $in: categories } },
      { $addToSet: { products: productId } }
    );

    return res.json(updatedProduct);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// @route   DELETE /products/:id
// @desc    Delete a product
// @access  Public
exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    // Find the product and retrieve its categories
    const product = await Product.findOne(productId);
    if (!product) {
      return res.status(404).json({ error: error.message });
    }

    const categories = product.categories;

    // Remove the product from the categories
    await Category.updateMany({ _id: { $in: categories } }, { $pull: { products: productId } });

    // Delete the product
    await Product.deleteOne({ _id: productId });

    return res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// @desc    Get all products or filter by type (trending or featured)
// @access  Public
exports.getAllProducts = async (req, res) => {
  try {
    const type = req.query.type; // Get the type query parameter
    let products;

    if (type === 'trending') {
      // Fetch only the trending products
      products = await Product.find({ type: 'trending' }).populate('categories', 'name');
    } else if (type === 'featured') {
      // Fetch only the featured products
      products = await Product.find({ type: 'featured' }).populate('categories', 'name');
    } else {
      // Fetch all products
      products = await Product.find().populate('categories', 'name');
    }

    return res.json(products);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


// Controller to get all products with a specific category name
exports.getProductsByCategory = async (req, res) => {
  try {
    const categoryName = req.query.category;

    // Find the category by name
    const category = await Category.findOne({ name: categoryName });

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Find the products with matching category name
    const products = await Product.find({
      categories: category._id,
    }).populate('categories', 'name imgUrl',);

    return res.json(products);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//Filter products by subcategories
exports.getProductsBySubcategories = async (req, res) => {
  try {
    const subcategories = req.query.subcategories; // Get the subcategories query parameter as an array

    // Create a filter object to match products with any of the specified subcategories
    const filter = {
      subcategories: { $in: subcategories }
    };

    const products = await Product.find(filter).populate('categories', 'name');

    return res.json(products);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

