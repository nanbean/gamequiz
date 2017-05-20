var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var suggestionSchema = new Schema({
  category: String
});

module.exports = mongoose.model('suggestion', suggestionSchema);
