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
var Feedback = require('./models/feedback');

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
	// 	teacherId: '',
	// 	quizId: 3,
	// 	gameMode: 'NORMAL',
	// 	status: 'WAIT',
	// 	studentPlayerList: [
	// 		{
	// 			studentId: '',
	// 			studentName: '',
	// 			studentNick: '',
	// 			answerList: [
	// 				{
	// 					questionId: '',
	// 					answer: 1,
	// 					correct: true,
	// 					score: 100
	// 				}
	// 			]
	// 		}
	// 	],
	// 	survivors: [],
	// 	previousRank: [],
	// 	currentQuestionIndex: 0,
	// 	presentationTime: new Date(),
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

router.post('/teacher/unRegisterTeacher', function(req, res){
	var teacherId = req.body.teacherId;
	var data = {
		error: '',
		return : false
	};

	if (teacherId) {
		Teacher.remove({teacherId: teacherId}, function(err, teacher) {
			if (err) {
				return res.send(data);
			}

			if (teacher) {
				data.valid = true;
				return res.send(data);
			}

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
		return: false,
		quizList: []
	};

	if (teacherId) {
		Teacher.findOne({teacherId: teacherId}, function(err, teacher) {
			if (err) {
				return res.send(data);
			}

			if (teacher) {
				Quiz.find({_id: {$in: teacher.quizList.map(function(o){ return mongoose.Types.ObjectId(o); })}}, function(err, quizList) {
					if (err) {
						return res.send(data);
					}

					data.return = true;
					data.quizList = quizList;
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

router.post('/teacher/getFeedBackList', function(req, res){
	var teacherId = req.body.teacherId;
	var data = {
		feedBackList: []
	};

	Feedback.find({teacherId: teacherId}, function(err, feedBackList) {
		if (err) {
			return res.send(data);
		}

		data.feedBackList = feedBackList;
		res.send(data);
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
		return: false,
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

					data.return = true;
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

			question.category = modifiedQuestion.category;
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

				updateSuggestions(modifiedQuestion.category);
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
		question.category = newQuestion.category;
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
					res.send(data);

					updateSuggestions(newQuestion.category);
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

function updateSuggestions (categories) {
	for (var i = 0 ; i <  categories.length; i++) {
		var suggestion = {
			category: categories[i].text
		}
		Suggestion.update(
			{category: suggestion.category},
			{$setOnInsert: suggestion},
			{upsert: true},
			function(err, numAffected) {
				console.log(numAffected);
			}
		);
	}
}

router.post('/teacher/getTagSuggestions', function(req, res){
	var data = {
		suggestions: []
	};

	Suggestion.find({}, function(err, suggestions) {
		data.suggestions = [...new Set(suggestions.map(function(o){ return o.category; }))];
		res.send(data);
	});
});

function startGameMode (teacherId, quizId, gameMode) {
	var playId;

	playId = Math.floor((Math.random() * 10000) + 1).toString();;

	plays.push({
		playId: playId,
		teacherId: teacherId,
		quizId: quizId,
		gameMode: gameMode,
		status: 'INIT_WAIT',
		studentPlayerList: [],
		survivors: [],
		currentQuestionIndex: 0
	});

	return {
		playId: playId,
		gameMode: gameMode
	};
}

router.post('/teacher/startGameMode', function(req, res){
	var teacherId = req.body.teacherId;
	var quizId = req.body.quizId;
	var gameMode = req.body.gameMode;

	var data = {};

	data = startGameMode(teacherId, quizId, gameMode);

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

function updateFeedbackAndDeletePlay (playId) {
	var play = getPlayWithPlayId(playId);
	for (var i = 0; i < play.studentPlayerList.length; i++) {
		const player = play.studentPlayerList[i];
		var wrongQuestions = [];

		if (player && player.answerList) {
			for (var j = 0; j < player.answerList.length; j++) {
				if (player.answerList[j].correct === false) {
					wrongQuestions.push(player.answerList[j].questionId);
				}
			}

			Feedback.update(
				{studentName: player.studentName, teacherId: play.teacherId},
				{$push: {wrongQuestions: {$each: wrongQuestions}}, $set: { lastPlayId: playId, lastWrongQuestions: wrongQuestions }},
				{upsert: true},
				function(err, numAffected) {
					if (i >= play.studentPlayerList.length - 1) {
						deletePlayWithPlayId(playId);
					}
				}
			);
		}
	}
	// 	studentPlayerList: [
	// 		{
	// 			studentId: '',
	// 			studentName: '',
	// 			studentNick: '',
	// 			answerList: [
	// 				{
	// 					questionId: '',
	// 					answer: 1,
	// 					correct: true,
	// 					score: 100
	// 				}
	// 			]
	// 		}
	// 	],
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

			if (play.gameMode === 'SURVIVAL') {
				data.survivors = play.survivors.map(function(student){ return {studentId: student.studentId, studentNick: student.studentNick}; });
			}

			if (play.currentQuestionIndex >= quiz.questionList.length - 1 || (play.gameMode === 'SURVIVAL' && data.survivors.length < 1)) {
				data.serverStatus = 'END';

				play.status = 'END';

				for (var i = 0; i < play.studentPlayerList.length; i++) {
					var student = {};
					var answerList = play.studentPlayerList[i].answerList;
					student.studentId = play.studentPlayerList[i].studentId;
					student.studentNick = play.studentPlayerList[i].studentNick;
					student.score = 0;

					console.log('student.studentNick: ' + student.studentNick);

					if (answerList) {
						for (var j = 0; j < answerList.length; j++) {
							console.log('score ' + j + ' : ' + play.studentPlayerList[i].answerList[j].score);
							student.score = parseInt(student.score + play.studentPlayerList[i].answerList[j].score);
						}
					}

					data.leaderBoard.push(student);
				}

				if (play.gameMode === 'MARATHON') {
					updateFeedbackAndDeletePlay(playId);
				} else if (play.gameMode === 'SURVIVAL') {
					deletePlayWithPlayId(playId);
				}
			} else {
				data.serverStatus = 'LEADER_BOARD';

				play.status = 'LEADER_BOARD';

				for (var i = 0; i < play.studentPlayerList.length; i++) {
					var student = {};
					var answerList = play.studentPlayerList[i].answerList;

					student.studentId = play.studentPlayerList[i].studentId;
					student.studentNick = play.studentPlayerList[i].studentNick;
					student.score = 0;

					console.log('student.studentNick: ' + student.studentNick);

					if (answerList) {
						for (var j = 0; j < answerList.length; j++) {
							console.log('score ' + j + ' : ' + play.studentPlayerList[i].answerList[j].score);
							student.score = parseInt(student.score + play.studentPlayerList[i].answerList[j].score);
						}
					}

					data.leaderBoard.push(student);
				}
			}

			data.leaderBoard = data.leaderBoard.sort(function(a, b){return b.score-a.score});

			if (play.previousRank) {
				var maxRank = 3;
				if (play.studentPlayerList.length < maxRank) {
					maxRank = play.studentPlayerList.length;
				}

				for (var k = 0; k < maxRank; k++) {
					var newRanker = true;
					var rocket = true;
					for (var q = 0; q < maxRank; q++) {
						if (data.leaderBoard[k].studentId === play.previousRank[q].studentId) {
							newRanker = false;
						}
					}

					if (!newRanker) {
						for (var q = 0; q <= k; q++) {
							if (data.leaderBoard[k].studentId === play.previousRank[q].studentId) {
								rocket = false
							}
						}
					}
					data.leaderBoard[k].newRanker = newRanker;
					data.leaderBoard[k].rocket = !newRanker && rocket;
				}
			}

			play.previousRank = data.leaderBoard;

			getServerEvent.publish(JSON.stringify(data));
			getServerEventTeacher.publish(JSON.stringify(data));
		});
	}
}

function sendResult (playId) {
	var data = {};
	var play = getPlayWithPlayId(playId);
	var quizId = play && play.quizId;

	data.playId = playId;
	data.serverStatus = 'RESULT';

	play.status = 'RESULT';

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

				if (play.gameMode === 'SURVIVAL') {
					data.result.survivors = play.survivors.map(function(student){ return {studentId: student.studentId, studentNick: student.studentNick}; });
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
	var play = getPlayWithPlayId(playId);
	var data = {};

	data.playId = playId;
	data.serverStatus = 'WAIT';

	play.status = 'WAIT';

	getServerEvent.publish(JSON.stringify(data));
	getServerEventTeacher.publish(JSON.stringify(data));
}

function sendQuetion (playId) {
	var data = {};
	var timeOut;
	var play = getPlayWithPlayId(playId);

	if (play) {
		Quiz.findById(play.quizId, function(err, quiz){
			if (err) {
				console.error(err);
			}
			if (quiz) {
				data.playId = playId;
				data.serverStatus = 'PLAY';

				play.status = 'PLAY';

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
	}, 2000);
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
	}, 2000);

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
	var play = playId && getPlayWithPlayId(playId);
	var data = {};

	if (getPlayWithPlayId(playId)) {
		if (play.status == 'INIT_WAIT') {
			data.valid = true;
		}
	} else {
		data.valid = false;
	}

	res.send(data);
});

function addStudentPalyer (playId, student) {
	var play = getPlayWithPlayId(playId);

	if (play) {
		play.studentPlayerList.push(student);
		play.survivors.push(student);

		if (play.status == 'INIT_WAIT') {
			getServerEventTeacher.publish(JSON.stringify(play));
		}
	}
}

router.post('/student/sendStudentInfo', function(req, res){
	const studentNick = req.body.studentNick;
	const studentName = req.body.studentName;
	const playId = req.body.playId;
	const play = playId && getPlayWithPlayId(playId);

	var data = {
		return: false
	};

	if (play && play.status === 'INIT_WAIT') {
		data.playId = playId;
		data.studentId = Math.floor((Math.random() * 10000) + 1);
		data.studentNick = studentNick;
		data.studentName = studentName;
		addStudentPalyer(playId, data);
		data.return = true;
	}

	res.send(data);
});

router.post('/student/getLastFeedBackList', function(req, res){
	const studentName = req.body.studentName;
	const playId = req.body.playId;

	var data = {
		feedBackList: [],
		questionList: []
	};

	if (playId && studentName) {
		Feedback.findOne({lastPlayId: playId, studentName: studentName}, function(err, feedBackList) {
			if (err) {
				return res.send(data);
			}

			if (feedBackList) {
				data.feedBackList = feedBackList;

				for (var i = 0; i < feedBackList.lastWrongQuestions.length; i++) {
					Question.findById(feedBackList.lastWrongQuestions[i], function(err, question) {
						if (err) {
							console.error(err);
						}

						if (question) {
							data.questionList.push(question);
						}

						if (i >= feedBackList.lastWrongQuestions.length - 1) {
							res.send(data);
						}
					});
				}
			} else {
				res.send(data);
			}
		});
	} else {
		res.send(data);
	}
});

function calculateScore (playTimeOut, presentationTime, answerTime) {
	var elapsedTime = answerTime - presentationTime;
	var score = playTimeOut*25 - elapsedTime/1000*25;
	// 25 is temporary number

	if (score < 0) {
		score = 0;
	}

	return score;
}

function updateAnswerToPlay (playId, studentId, answer) {
	var play = getPlayWithPlayId(playId);
	var quizId = play && play.quizId;

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
						if (play.gameMode === 'SURVIVAL') {
							if (question.answer !== answer) {
								for (var i = 0; i < play.survivors.length; i++) {
									if ( play.survivors[i].studentId == studentId) {
										play.survivors.splice(i, 1);
									}
								}
							}
						}

						for (var i = 0; i < play.studentPlayerList.length; i++) {
							if ( play.studentPlayerList[i].studentId == studentId) {
								if (!play.studentPlayerList[i].answerList) {
									play.studentPlayerList[i].answerList = [];
								}

								play.studentPlayerList[i].answerList.push({
									questionId: question._id,
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
				// if (play && play.nextStepTimer) {
				// 	clearInterval(play.nextStepTimer);
				// 	play.nextStepTimer =  null;
				// }

				if (play.status == 'INIT_WAIT') {
					getServerEventTeacher.publish(JSON.stringify(play));
				}
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
