var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var teacherSchema = new Schema({
    teacherId: String,
    quizList: Array
});

module.exports = mongoose.model('teacher', teacherSchema);
