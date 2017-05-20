var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var questionSchema = new Schema({
	quizCategory: Array,
	title: String,
	pictureUrl: String,
	example1: String,
	example2: String,
	example3: String,
	example4: String,
	answer: Number,
	timer: Number
});

module.exports = mongoose.model('question', questionSchema);
