const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchemaDefinition = new Schema({
  name: {
    type: String,
    required: true
  },
  desc: {
    type: String,
    required: false
  },
  imgUrl: {
    type: [String],
    required: false
  },
  subcategories: {
    type: [String],
    required: false
  },
  products: [{
    type: mongoose.Types.ObjectId, 
    ref: 'Product',
    required: false
  }]
});

var categorySchema = new mongoose.Schema(categorySchemaDefinition);

module.exports = mongoose.model('Category', categorySchema);