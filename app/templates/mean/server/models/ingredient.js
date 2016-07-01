var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var IngredientSchema   = new Schema({
    name: { type: String, unique: true, required : true }
});

module.exports = mongoose.model('Ingredient', IngredientSchema);