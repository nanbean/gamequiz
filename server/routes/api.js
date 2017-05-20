const express = require('express');
const router = express.Router();
const fs = require('fs');
const multer  = require('multer');
const getServerEventTeacher = require("./sse");
const getServerEvent = require("./sse");
const mongoose = require('mongoose');

const db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
		// CONNECTED TO MONGODB SERVER
		console.log("Connected to mongod server");
});

mongoose.connect('mongodb://localhost/gamequiz');


var Teacher = require('./models/teacher');
var Quiz = require('./models/quiz');
var Question = require('./models/question');
var Suggestion = require('./models/suggestion');

router.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*")
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
	next()
})

router.get('/', function(req, res, next) {
	res.json({})
})

var feedback = [
	{
		studentId: 0,
		studentName: 'James',
		wrongQuestionList: [
			3,
			4,
		]
	},
	{
		studentId: 1,
		studentName: 'Tom',
		wrongQuestionList: [
			1,
			2
		]
	},
	{
		studentId: 2,
		studentName: 'Aron',
		wrongQuestionList: [
			1,
			2,
			3,
			4,
			5,
			6
		]
	},
	{
		studentId: 3,
		studentName: 'John',
		wrongQuestionList: [
			6
		]
	}
];

var plays = [
	// {
	// 	playId: 1234,
	// 	quizId: 3,
	// 	gameMode: 'NORMAL'
	// 	studentPlayerList: [],
	// 	currentQuestionIndex: 0
	// 	presentationTime: new Date()
	// 	nextStepTimer: new Date()
	// }
];

router.post('/teacher/checkTeacher', function(req, res){
	var teacherId = req.body.teacherId;
	var data = {
		valid: false
	};

	Teacher.findOne({teacherId: teacherId}, function(err, teacher) {
		if (err) {
			return res.send(data);
		}

		if (teacher) {
			data.valid = true;
			return res.send(data);
		}

		res.send(data);
	});
});

router.post('/teacher/registerTeacher', function(req, res){
	var teacherId = req.body.teacherId;
	var data = {
		error: '',
		return : false
	};

	if (teacherId) {
		var teacher = new Teacher();
		teacher.teacherId = teacherId;
		teacher.quizList = [];

		teacher.save(function(err){
			if(err) {
				data.error = 'DB_ERROR'
				return res.send(data);
			}

			data.return = true;
			res.send(data);
		});
	} else {
		data.error = 'NO_TEACHER_ID'
		res.send(data);
	}
});

router.post('/teacher/getQuizList', function(req, res){
	var teacherId = req.body.teacherId;
	var data = {
		quizList: []
	};

	if (teacherId) {
		Teacher.findOne({teacherId: teacherId}, function(err, teacher) {
			if (err) {
				return res.send(data);
			}

			Quiz.find({_id: {$in: teacher.quizList.map(function(o){ return mongoose.Types.ObjectId(o); })}}, function(err, quizList) {
				if (err) {
					return res.send(data);
				}

				data.quizList = quizList;
				res.send(data);
			});
		});
	} else {
		res.send(data);
	}
});

router.post('/teacher/getFeedBackList', function(req, res){
	res.send({
		feedBackList: feedback
	});
});

function addQuiztoTeacher (teacherId, quizId) {
	for (var i = 0; i < teacher.length; i++) {
		if (teacher[i].teacherId == teacherId) {
			teacher[i].quizList.push(quizId);
		}
	}
}

router.post('/teacher/addQuiz', function(req, res){
	var teacherId = req.body.teacherId;
	var newQuiz = req.body.quiz;
	var data = {
		return: false
	};

	if (teacherId && newQuiz) {
		var quiz = new Quiz();

		quiz.quizTitle = newQuiz.quizTitle;
		quiz.questionList = newQuiz.questionList;

		quiz.save(function(err){
			if(err) {
				return res.send(data);
			}

			Teacher.findOne({teacherId: teacherId}, function(err, teacher) {
				if (err) {
					return res.send(data);
				}

				teacher.quizList.push(quiz._id);

				teacher.save(function(err){
					if (err) {
						return res.send(data);
					}

					data.quizId = quiz._id
					data.return = true;
					res.send(data);
				});
			});
		});
	} else {
		res.send(data);
	}
});

router.post('/teacher/editQuiz', function(req, res){
	var quizModified = req.body.quiz;
	var data = {
		return: false
	};

	Quiz.findById(quizModified._id, function(err, quiz){
		if (err) {
			return res.send(data);
		}

		quiz.quizTitle = quizModified.quizTitle;
		quiz.questionList = quizModified.questionList;

		quiz.save(function(err){
			if (err) {
				return res.send(data);
			}

			data.return = true;
			res.send(data);
		});
	});
});

router.post('/teacher/deleteQuiz', function(req, res){
	var teacherId = req.body.teacherId;
	var quizId = req.body.quizId;
	var data = {
		return: false
	};

	Teacher.findOne({teacherId: teacherId}, function(err, teacher) {
		if (err) {
			return res.send(data);
		}

		for (var i = 0; i < teacher.quizList.length; i++) {
			if (teacher.quizList[i] == quizId) {
				teacher.quizList.splice(i, 1);
			}
		}

		teacher.save(function(err){
			if (err) {
				return res.send(data);
			}

			Quiz.remove({_id: quizId}, function(err, quiz){
				if (err) {
					return res.send(data);
				}

				data.return = true;
				res.send(data);
			});

		});
	});
});

router.post('/teacher/getQuestionList', function(req, res){
	var quizId = req.body.quizId;
	var data = {
		questionList: []
	};

	if (quizId) {
		Quiz.findById(quizId, function(err, quiz) {
			if (err) {
				return res.send(data);
			}

			if (quiz && quiz.questionList) {
				Question.find({_id: {$in: quiz.questionList.map(function(o){ return mongoose.Types.ObjectId(o); })}}, function(err, questionList) {
					if (err) {
						return res.send(data);
					}

					data.questionList = questionList;
					res.send(data);
				});
			} else {
				res.send(data);
			}
		});
	} else {
		res.send(data);
	}
});

function addQuestiontoQuiz (quizId, questionId) {
	for (var i = 0; i < quizzes.length; i++) {
		if (quizzes[i].quizId == quizId) {
			quizzes[i].questionList.push(questionId);
			break;
		}
	}
}

router.post('/teacher/editQuestion', function(req, res){
	var modifiedQuestion = req.body.question;
	var data = {
		return: false
	};

	if (modifiedQuestion) {
		Question.findById(modifiedQuestion._id, function(err, question) {
			if (err) {
				return res.send(data);
			}

			question.quizCategory = modifiedQuestion.quizCategory;
			question.title = modifiedQuestion.title;
			question.pictureUrl = modifiedQuestion.pictureUrl;
			question.example1 = modifiedQuestion.example1;
			question.example2 = modifiedQuestion.example2;
			question.example3 = modifiedQuestion.example3;
			question.example4 = modifiedQuestion.example4;
			question.answer = modifiedQuestion.answer;
			question.timer = modifiedQuestion.timer;

			question.save(function(err){
				if (err) {
					return res.send(data);
				}

				data.return = true;
				res.send(data);
			});
		});
	} else {
		res.send(data);
	}
});

router.post('/teacher/addQuestion', function(req, res){
	var newQuestion = req.body.question;
	var quizId = req.body.quizId;

	var data = {
		return: false
	};

	if (newQuestion) {
		var question = new Question();
		question.quizCategory = newQuestion.quizCategory;
		question.title = newQuestion.title;
		question.pictureUrl = newQuestion.pictureUrl;
		question.example1 = newQuestion.example1;
		question.example2 = newQuestion.example2;
		question.example3 = newQuestion.example3;
		question.example4 = newQuestion.example4;
		question.answer = newQuestion.answer;
		question.timer = newQuestion.timer;

		question.save(function(err){
			if (err) {
				return res.send(data);
			}

			Quiz.findById(quizId, function(err, quiz) {
				if (err) {
					return res.send(data);
				}

				quiz.questionList.push(question._id);

				quiz.save(function(err){
					if (err) {
						return res.send(data);
					}

					data.return = true;
					data.quizId = quizId;
					res.send(data);
				});
			});
		});
	} else {
		res.send(data);
	}
});

router.post('/teacher/deleteQuestion', function(req, res){
	var teacherId = req.body.teacherId;
	var quizId = req.body.quizId;
	var questionId = req.body.questionId;
	var data = {
		return: false
	};

	Quiz.findById(quizId, function(err, quiz) {
		if (err) {
			return res.send(data);
		}

		if (quiz && quiz.questionList) {
			for (var i = 0; i < quiz.questionList.length; i++) {
				if (quiz.questionList[i] == questionId) {
					quiz.questionList.splice(i, 1);
					break;
				}
			}

			quiz.save(function(err){
				if (err) {
					return res.send(data);
				}

				data.return = true;
				data.quizId = quizId;
				res.send(data);
			});
		}
	});
});

let upload = multer({
	storage: multer.diskStorage({
		destination: (req, file, callback) => {
			let teacherId = req.params.teacherId;
			let path = `./uploads/${teacherId}`;
			if(!fs.existsSync('./uploads')) {
				fs.mkdirSync('./uploads');
			}
			if(!fs.existsSync(path)) {
				fs.mkdirSync(path);
			}
			callback(null, path);
		},
		filename: (req, file, callback) => {
			callback(null, file.originalname);
		}
	})
});

router.post('/teacher/uploadImage/:teacherId', upload.any(), function (req, res, next) {
	res.status(200).send({
		path: req.files[0].path
	});
});

router.post('/teacher/getTagSuggestions', function(req, res){
	var data = {
		suggestions: []
	};

	Suggestion.find({}, function(err, suggestions) {
		data.suggestions = [...new Set(suggestions.map(function(o){ return o.category; }))];
		res.send(data);
	});
});

function startGameMode (quizId, gameMode) {
	var playId;

	playId = Math.floor((Math.random() * 10000) + 1).toString();;

	plays.push({
		playId: playId,
		quizId: quizId,
		gameMode: gameMode,
		studentPlayerList: [],
		currentQuestionIndex: 0
	})

	return {
		playId: playId,
		gameMode: gameMode
	};
}

router.post('/teacher/startGameMode', function(req, res){
	var quizId = req.body.quizId;
	var gameMode = req.body.gameMode;

	var data = {};

	data = startGameMode(quizId, gameMode);

	res.send(data);
});

function getPlayWithPlayId (playId) {
	for (var i = 0; i < plays.length; i++) {
		if (plays[i].playId == playId) {
			return plays[i];
		}
	}

	return null;
}

function deletePlayWithPlayId (playId) {
	for (var i = 0; i < plays.length; i++) {
		if (plays[i].playId == playId) {
			plays.splice(i, 1);
		}
	}
}

function getQuizWithQuizId (quizId) {
	for (var i = 0; i < quizzes.length; i++) {
		if (quizzes[i].quizId == quizId) {
			return quizzes[i];
		}
	}

	return null;
}

function getQuestionWithQuestionId (questionId) {
	for (var i = 0; i < questions.length; i++) {
		if (questions[i].questionId == questionId) {
			return questions[i];
		}
	}

	return null;
}

function sendLeaderBoard (playId) {
	var data = {};
	var play = getPlayWithPlayId(playId);
	var quizId = play && play.quizId;

	if (play && quizId) {
		Quiz.findById(quizId, function(err, quiz){
			if (err) {
				console.error(err);
			}

			data.playId = playId;
			data.leaderBoard = [];
			if (play.currentQuestionIndex < quiz.questionList.length - 1) {
				data.serverStatus = 'LEADER_BOARD';

				for (var i = 0; i < play.studentPlayerList.length; i++) {
					var student = {};
					var answerList = play.studentPlayerList[i].answerList;

					student.studentId = play.studentPlayerList[i].studentId;
					student.studentNick = play.studentPlayerList[i].studentNick;
					student.score = 0;

					if (answerList) {
						for (var j = 0; j < answerList.length; j++) {
							student.score = parseInt(student.score + play.studentPlayerList[i].answerList[j].score);
						}
					}
					data.leaderBoard.push(student);
				}
			} else {
				data.serverStatus = 'END';

				for (var i = 0; i < play.studentPlayerList.length; i++) {
					var student = {};
					var answerList = play.studentPlayerList[i].answerList;
					student.studentId = play.studentPlayerList[i].studentId;
					student.studentNick = play.studentPlayerList[i].studentNick;
					student.score = 0;

					if (answerList) {
						for (var j = 0; j < answerList.length; j++) {
							student.score = parseInt(student.score + play.studentPlayerList[i].answerList[j].score);
						}
					}
					data.leaderBoard.push(student);
				}

				deletePlayWithPlayId(playId);
			}

			getServerEvent.publish(JSON.stringify(data));
			getServerEventTeacher.publish(JSON.stringify(data));
		});
	}
}

function sendResult (playId) {
	var data = {};
	var play = getPlayWithPlayId(playId);
	var quizId = play && play.quizId;
	// var quiz = play && getQuizWithQuizId(play.quizId);
	// var question = quiz && getQuestionWithQuestionId(quiz.questionList[play.currentQuestionIndex]);

	data.playId = playId;
	data.serverStatus = 'RESULT';

	if (play && quizId) {
		Quiz.findById(quizId, function(err, quiz){
			if (err) {
				console.error(err);
			}

			var questionId = quiz.questionList[play.currentQuestionIndex];

			Question.findById(questionId, function(err, question){
				if (err) {
					console.error(err);
				}

				data.result = {
					answer: question.answer,
					example1: 0,
					example2: 0,
					example3: 0,
					example4: 0
				};

				for (var i = 0; i < play.studentPlayerList.length; i++) {
					var answerList = play.studentPlayerList[i].answerList;
					if (answerList && answerList[play.currentQuestionIndex] && answerList[play.currentQuestionIndex].answer == 1) {
						data.result.example1++;
					}
					else if (answerList && answerList[play.currentQuestionIndex] && answerList[play.currentQuestionIndex].answer == 2) {
						data.result.example2++;
					}
					else if (answerList && answerList[play.currentQuestionIndex] && answerList[play.currentQuestionIndex].answer == 3) {
						data.result.example3++;
					}
					else if (answerList && answerList[play.currentQuestionIndex] && answerList[play.currentQuestionIndex].answer == 4) {
						data.result.example4++;
					}
				}

				getServerEvent.publish(JSON.stringify(data));
				getServerEventTeacher.publish(JSON.stringify(data));

				play.nextStepTimer = setTimeout(function() {
					sendLeaderBoard(playId);
				}, 5000);
			});
		});
	}

	// if (play && quiz && question) {
	// 	data.result = {
	// 		answer: question.answer,
	// 		example1: 0,
	// 		example2: 0,
	// 		example3: 0,
	// 		example4: 0
	// 	};

	// 	for (var i = 0; i < play.studentPlayerList.length; i++) {
	// 		var answerList = play.studentPlayerList[i].answerList;
	// 		if (answerList && answerList[play.currentQuestionIndex] && answerList[play.currentQuestionIndex].answer == 1) {
	// 			data.result.example1++;
	// 		}
	// 		else if (answerList && answerList[play.currentQuestionIndex] && answerList[play.currentQuestionIndex].answer == 2) {
	// 			data.result.example2++;
	// 		}
	// 		else if (answerList && answerList[play.currentQuestionIndex] && answerList[play.currentQuestionIndex].answer == 3) {
	// 			data.result.example3++;
	// 		}
	// 		else if (answerList && answerList[play.currentQuestionIndex] && answerList[play.currentQuestionIndex].answer == 4) {
	// 			data.result.example4++;
	// 		}
	// 	}

	// 	getServerEvent.publish(JSON.stringify(data));
	// 	getServerEventTeacher.publish(JSON.stringify(data));

	// 	play.nextStepTimer = setTimeout(function() {
	// 		sendLeaderBoard(playId);
	// 	}, 5000);
	// }
}

function sendWait (playId) {
	var data = {};

	data.playId = playId;
	data.serverStatus = 'WAIT';

	getServerEvent.publish(JSON.stringify(data));
	getServerEventTeacher.publish(JSON.stringify(data));
}

function sendQuetion (playId) {
	var data = {};
	var timeOut;
	var play = getPlayWithPlayId(playId);
	// var quiz = play && getQuizWithQuizId(play.quizId);

	if (play) {
		Quiz.findById(play.quizId, function(err, quiz){
			if (err) {
				console.error(err);
			}
			if (quiz) {
				data.playId = playId;
				data.serverStatus = 'PLAY';

				Question.findById(quiz.questionList[play.currentQuestionIndex], function(err, question){
					if (err) {
						console.error(err);
					}
					data.question = question;
					timeOut = question.timer;
					data.timeOut = question.timer;

					play.presentationTime = new Date();
					play.timeOut = timeOut;

					getServerEvent.publish(JSON.stringify(data));
					getServerEventTeacher.publish(JSON.stringify(data));

					play.nextStepTimer = setInterval(function() {
						timeOut--;
						data.timeOut = timeOut;
						if ( timeOut >= 0) {
							getServerEvent.publish(JSON.stringify(data));
							getServerEventTeacher.publish(JSON.stringify(data));
						} else {
							if (play && play.nextStepTimer) {
								play && clearInterval(play.nextStepTimer);
								play.nextStepTimer =  null;
							}
							sendResult(playId);
						}
					}, 1000);
				});
			}
		});
	}
}

function startPlay (playId) {
	var play = getPlayWithPlayId(playId);

	sendWait(playId);

	play.nextStepTimer = setTimeout(function() {
		sendQuetion(playId);
	}, 5000);
}

router.post('/teacher/nextPlayQuestion', function(req, res){
	var playId = req.body.playId;
	var play = getPlayWithPlayId(playId);

	var data = {
		return: true
	};

	play.currentQuestionIndex++;
	sendWait(playId);

	play.nextStepTimer = setTimeout(function() {
		sendQuetion(playId);
	}, 5000);

	res.send(data);
});

router.post('/teacher/startPlay', function(req, res){
	var playId = req.body.playId;

	var data = {
		return: true
	};

	// this is for test only
	// TO DO: need to add game send
	// TO DO: need to add gmae leader board
	startPlay(playId);

	res.send(data);
});

function terminatePlay (playId) {
	var data = {};
	var play = getPlayWithPlayId(playId);
	var quiz = play && getQuizWithQuizId(play.quizId);

	data.playId = playId;
	data.leaderBoard = [];
	data.serverStatus = 'END';

	getServerEvent.publish(JSON.stringify(data));

	if (play && play.nextStepTimer) {
		clearInterval(play.nextStepTimer);
		play.nextStepTimer =  null;
	}

	deletePlayWithPlayId(playId);
}

function initialiseGetServerEventTeacherSSE(req, res) {
	const playId = req.query.playId;

	var subscriber = getServerEventTeacher.subscribe(function(channel, message){
			var messageEvent = new ServerEvent();
			messageEvent.addData(message);
			outputGetServerEventTeacherSSE(req, res, messageEvent.payload());
	});

	res.set({
			"Content-Type": "text/event-stream",
			"Cache-Control": "no-cache",
			"Connection": "keep-alive",
			"Access-Control-Allow-Origin": "*"
	});

	res.write("retry: 10000\n\n");

	var keepAlive = setInterval(function() {
		outputGetServerEventTeacherSSE(req, res, ':keep-alive\n\n');
	}, 20000);

	res.on('close', function close() {
		keepAlive && clearInterval(keepAlive);
		terminatePlay(playId);

		// TO DO: need to send play end event to Students

		getServerEventTeacher.unsubscribe(subscriber);
	});
}

function outputGetServerEventTeacherSSE(req, res, data) {
	res.write(data);
			if (res.flush && data.match(/\n\n$/)) {
		res.flush();
	}
}

function ServerEvent() {
	this.data = "";
};

ServerEvent.prototype.addData = function(data) {
	var lines = data.split(/\n/);

	for (var i = 0; i < lines.length; i++) {
			var element = lines[i];
			this.data += "data:" + element + "\n";
	}
}

ServerEvent.prototype.payload = function() {
	var payload = "";

	payload += this.data;
	return payload + "\n";
}

router.get("/teacher/getServerEventTeacher", function(req, res) {
	const playId = req.body.playId;
	initialiseGetServerEventTeacherSSE(req, res);

	getServerEventTeacher.publish(JSON.stringify({serverStatus: 'WAIT'}));
});

router.post('/student/checkPlayId', function(req, res){
	var playId = req.body.playId;
	var data = {};

	if (getPlayWithPlayId(playId)) {
		data.valid = true;
	} else {
		data.valid = false;
	}

	res.send(data);
});

function addStudentPalyer (playId, student) {
	var play = getPlayWithPlayId(playId);

	if (play) {
		getPlayWithPlayId(playId).studentPlayerList.push(student);
		getServerEventTeacher.publish(JSON.stringify(play));
	}
}

router.post('/student/sendStudentInfo', function(req, res){
	const studentNick = req.body.studentNick;
	const playId = req.body.playId;

	var data = {};

	data.playId = playId;
	data.studentId = Math.floor((Math.random() * 10000) + 1);
	data.studentNick = studentNick;

	addStudentPalyer(playId, data)

	res.send(data);
});

function calculateScore (playTimeOut, presentationTime, answerTime) {
	var elapsedTime = answerTime - presentationTime;
	var score = playTimeOut*25 - elapsedTime/1000*25;
	// 25 is temporary number

	return score;
}

function updateAnswerToPlay (playId, studentId, answer) {
	var play = getPlayWithPlayId(playId);
	var quizId = play && play.quizId;
	// var quiz = play && getQuizWithQuizId(play.quizId);
	// var question = quiz && getQuestionWithQuestionId(quiz.questionList[play.currentQuestionIndex]);


if (play && quizId) {
		Quiz.findById(quizId, function(err, quiz){
			if (err) {
				console.error(err);
			}

			var questionId = quiz && quiz.questionList[play.currentQuestionIndex];

			if (questionId) {
				Question.findById(quiz.questionList[play.currentQuestionIndex], function(err, question){
					if (err) {
						console.error(err);
					}

					if (question) {
						for (var i = 0; i < play.studentPlayerList.length; i++) {
							if ( play.studentPlayerList[i].studentId == studentId) {
								if (!play.studentPlayerList[i].answerList) {
									play.studentPlayerList[i].answerList = [];
								}

								play.studentPlayerList[i].answerList.push({
									questionId: question.questionId,
									answer: answer,
									correct: question.answer == answer,
									score: question.answer == answer ? calculateScore(play.timeOut, play.presentationTime, new Date()):0
								});
							}
						}
					}
				});
			}
		});
	}
}

router.post('/student/sendStudentAnswer', function(req, res){
	const playId = req.body.playId;
	const studentId = req.body.studentId;
	const answer = req.body.answer;

	var data = {
		return: true
	};

	updateAnswerToPlay(playId, studentId, answer);

	res.send(data);
});

function removeStudentFromPlay (playId, studentId) {
	var play = getPlayWithPlayId(playId);

	if (play) {
		for (let i = 0; i < play.studentPlayerList.length; i++) {
			if (play.studentPlayerList[i].studentId == studentId) {
				play.studentPlayerList.splice(i, 1);
				if (play && play.nextStepTimer) {
					clearInterval(play.nextStepTimer);
					play.nextStepTimer =  null;
				}
				getServerEventTeacher.publish(JSON.stringify(play));
				return;
			}
		}
	}
}

function initialiseGetServerEventSSE(req, res) {
	const playId = req.query.playId;
	const studentId = req.query.studentId;

	var subscriber = getServerEvent.subscribe(function(channel, message){
			var messageEvent = new ServerEvent();
			messageEvent.addData(message);
			outputGetServerEventSSE(req, res, messageEvent.payload());
	});

	res.set({
			"Content-Type": "text/event-stream",
			"Cache-Control": "no-cache",
			"Connection": "keep-alive",
			"Access-Control-Allow-Origin": "*"
	});

	res.write("retry: 10000\n\n");

	var keepAlive = setInterval(function() {
		outputGetServerEventSSE(req, res, ':keep-alive\n\n');
	}, 20000);

	res.on('close', function close() {
		keepAlive && clearInterval(keepAlive);
		getServerEvent.unsubscribe(subscriber);
		removeStudentFromPlay(playId, studentId);
	});
}

function outputGetServerEventSSE(req, res, data) {
	res.write(data);
	if (res.flush && data.match(/\n\n$/)) {
		res.flush();
	}
}

router.get("/getServerEvent", function(req, res) {
	var data = {};
	const playId = req.query.playId;
	initialiseGetServerEventSSE(req, res);

	data.playId = playId;
	data.serverStatus = 'WAIT';

	getServerEvent.publish(JSON.stringify(data));
});

module.exports = router
