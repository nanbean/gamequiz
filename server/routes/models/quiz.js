var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var quizSchema = new Schema({
  quizTitle: String,
  questionList: Array
});

module.exports = mongoose.model('quiz', quizSchema);
