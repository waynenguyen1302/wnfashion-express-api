const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchemaDefinition = new Schema({
  name: {
    type: String,
    required: true
  },
  desc: {
    type: String,
    required: false
  },
  img: {
    type: [String],
    required: false
  },
  promotion: {
    type: Number,
    required: false
  },
  price: {
    type: Number,
    required: true
  },
  subcategories: {
    type: [String],
    required: false
  },
  categories: [{ 
    type: mongoose.Types.ObjectId, 
    ref: 'Category' 
  }],  
  type: {
    type: String,
    enum: ["normal", "featured", "trending"],
    required: false
  }

});

var productSchema = new mongoose.Schema(productSchemaDefinition);

module.exports = mongoose.model('Product', productSchema);