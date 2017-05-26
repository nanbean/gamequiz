var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var feedbackSchema = new Schema({
	teacherId: String,
  studentName: String,
  wrongQuestions: Array
});

module.exports = mongoose.model('feedback', feedbackSchema);
