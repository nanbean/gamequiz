const express = require('express')
const router = express.Router()
const fs = require('fs');
const multer  = require('multer')
const getServerEventTeacher = require("./sse")
const getServerEvent = require("./sse")

router.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*")
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
	next()
})

router.get('/', function(req, res, next) {
	res.json({})
})

var teacher = [
	{
		teacherId: 10155828101494882,
		quizList: [1, 2, 3]
	}
];

var quizzes = [
	{
		quizId: 0,
		quizTitle: 'SEP521',
		questionList: [
			1
		]
	},
	{
		quizId: 1,
		quizTitle: 'Math',
		questionList: [
			1,
			6
		]
	},
	{
		quizId: 2,
		quizTitle: 'Korean',
		questionList: [
			1,
			2,
			3,
			4,
			5,
			6
		]
	},
	{
		quizId: 3,
		quizTitle: 'Funny',
		questionList: [
			1,
			2,
			3
		]
	}
];

var questions = [
	{
		questionId: 0,
		quizCategory: [
			{
				id: 1,
				text: "덧셈"
			},
			{
				id: 2,
				text: "산수"
			}
		],
		title: '1+1=?',
		pictureUrl: '',
		example1: '1',
		example2: '2',
		example3: '3',
		example4: '4',
		answer: 2,
		timer: 20
	},
	{
		questionId: 1,
		quizCategory: [
			{
				id: 1,
				text: "곱셈"
			},
			{
				id: 2,
				text: "산수"
			}
		],
		title: '5x5=?',
		pictureUrl: '',
		example1: '10',
		example2: '20',
		example3: '25',
		example4: '30',
		answer: 3,
		timer: 5
	},
	{
		questionId: 2,
		quizCategory: [
			{
				id: 1,
				text: "지리"
			},
			{
				id: 2,
				text: "나라"
			},
			{
				id: 3,
				text: "수도"
			}
		],
		title: '대한민국의 수도는?',
		pictureUrl: '',
		example1: '서울',
		example2: '부산',
		example3: '대구',
		example4: '광주',
		answer: 1,
		timer: 10
	},
	{
		questionId: 3,
		quizCategory: [
			{
				id: 1,
				text: "달력"
			},
			{
				id: 2,
				text: "생활"
			}
		],
		title: '1월은 몇일까지 있을까요?',
		pictureUrl: '',
		example1: '29',
		example2: '30',
		example3: '31',
		example4: '32',
		answer: 3,
		timer: 20
	},
	{
		questionId: 4,
		quizCategory: [
			{
				id: 1,
				text: "덧셈"
			},
			{
				id: 2,
				text: "산수"
			}
		],
		title: '1+1=?',
		pictureUrl: '',
		example1: '1',
		example2: '2',
		example3: '3',
		example4: '4',
		answer: 2,
		timer: 20
	},
	{
		questionId: 5,
		quizCategory: [
			{
				id: 1,
				text: "곱셈"
			},
			{
				id: 2,
				text: "산수"
			}
		],
		title: '5x5=?',
		pictureUrl: '',
		example1: '10',
		example2: '20',
		example3: '25',
		example4: '30',
		answer: 1,
		timer: 20
	},
	{
		questionId: 6,
		quizCategory: [
			{
				id: 1,
				text: "지리"
			},
			{
				id: 2,
				text: "나라"
			},
			{
				id: 3,
				text: "수도"
			}
		],
		title: '대한민국의 수도는?',
		pictureUrl: '',
		example1: '서울',
		example2: '부산',
		example3: '대구',
		example4: '광주',
		answer: 1,
		timer: 10
	},
	{
		questionId: 7,
		quizCategory: [
			{
				id: 1,
				text: "달력"
			},
			{
				id: 2,
				text: "생활"
			}
		],
		title: '1월은 몇일까지 있을까요?',
		pictureUrl: '',
		example1: '29',
		example2: '30',
		example3: '31',
		example4: '32',
		answer: 3,
		timer: 20
	}
];

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

function checkUserExist (teacherId) {
	for (var i = 0; i < teacher.length; i++) {
		if (teacher[i].teacherId == teacherId) {
			return true;
		}
	}

	return false;
}

router.post('/teacher/checkTeacher', function(req, res){
	var teacherId = req.body.teacherId;
	var data = {
		valid: false
	};

	if (teacherId && checkUserExist(teacherId)) {
		data.valid = true;
	}
	res.send(data);
});

router.post('/teacher/registerTeacher', function(req, res){
	var teacherId = req.body.teacherId;
	var data = {
		error: '',
		return : false
	};

	if (teacherId && !checkUserExist(teacherId)) {
		data.return = true;
		teacher.push({
			teacherId: teacherId,
			quizList: [1, 2, 3]
		});
		checkUserExist(11111);
	} else {
		data.error = 'ALREADY_EXIST'
	}

	res.send(data);
});

function getQuizList (teacherId) {
	var result = [];

	for (var i = 0; i < teacher.length; i++) {
		if (teacher[i].teacherId == teacherId) {
			for (var j = 0; j < teacher[i].quizList.length; j++) {
				result.push(quizzes[teacher[i].quizList[j]]);
			}
			break;
		}
	}

	return result;
}

router.post('/teacher/getQuizList', function(req, res){
	var teacherId = req.body.teacherId;
	var data = {};

	data.quizList = getQuizList(teacherId);

	res.send(data);
});

router.post('/teacher/getFeedBackList', function(req, res){
	res.send({
		feedBackList: feedback
	});
});

function getQuestionList (quizId) {
	var result = [];

	for (var i = 0; i < quizzes.length; i++) {
		if (quizzes[i].quizId == quizId) {
			for (var j = 0; j < quizzes[i].questionList.length; j++) {
				result.push(questions[quizzes[i].questionList[j]]);
			}
			break;
		}
	}

	return result;
}

function addQuiztoTeacher (teacherId, quizId) {
	for (var i = 0; i < teacher.length; i++) {
		if (teacher[i].teacherId == teacherId) {
			teacher[i].quizList.push(quizId);
		}
	}
}

function addQuiz (quiz) {
	var lastQuizId = 0;

	for (var i = 0; i < quizzes.length; i++) {
		if (quizzes[i].quizId > lastQuizId) {
			lastQuizId = quizzes[i].quizId;
		}
	}

	quiz.quizId = lastQuizId + 1;

	quizzes.push(quiz);

	return quiz.quizId;
}

router.post('/teacher/addQuiz', function(req, res){
	var teacherId = req.body.teacherId;
	var quiz = req.body.quiz;
	var data = {
		return: true
	};

	data.quizId = addQuiz(quiz);

	addQuiztoTeacher(teacherId, data.quizId);

	res.send(data);
});

function editQuiz (quiz) {
	for (var i = 0; i < quizzes.length; i++) {
		if (quizzes[i].quizId == quiz.quizId) {
			quizzes[i] = quiz;
			return true;
		}
	}

	return false;
}

router.post('/teacher/editQuiz', function(req, res){
	var quiz = req.body.quiz;
	var data = {
		return: true
	};

	if (editQuiz(quiz)) {

	} else {
		data.return = false;
	}
	res.send(data);
});

router.post('/teacher/getQuestionList', function(req, res){
	var quizId = req.body.quizId;
	var data = {};

	data.questionList = getQuestionList(quizId);

	res.send(data);
});

function editQuestion (question) {
	var result = [];

	for (var i = 0; i < questions.length; i++) {
		if (questions[i].questionId == question.questionId) {
			questions[i] = question;
			break;
		}
	}
}

function addQuestiontoQuiz (quizId, questionId) {
	for (var i = 0; i < quizzes.length; i++) {
		if (quizzes[i].quizId == quizId) {
			quizzes[i].questionList.push(questionId);
			break;
		}
	}
}

router.post('/teacher/editQuestion', function(req, res){
	var question = req.body.question;
	var data = {
		return: true
	};

	if (editQuestion(question)) {

	} else {
		data.return = false;
	}
	res.send(data);
});

router.post('/teacher/addQuestion', function(req, res){
	var question = req.body.question;
	var quizId = req.body.quizId;

	var data = {
		return: true
	};

	question.questionId = questions.length;

	addQuestiontoQuiz(quizId, question.questionId);
	questions.push(question);

	res.send(data);
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
	var suggestions = [];
	var data = {};

	for (var i = 0; i < questions.length; i++) {
		for (var j = 0; j < questions[i].quizCategory.length; j++) {
			if (questions[i].quizCategory[j] && questions[i].quizCategory[j].text) {
				suggestions.push(questions[i].quizCategory[j].text);
			}
		}
	}

	data.suggestions = [...new Set(suggestions)];

	res.send(data);
});

function startGameMode (quizId, gameMode) {
	var playId;
	var gameMode;

	playId = Math.floor((Math.random() * 10000) + 1);

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
	var quiz = play && getQuizWithQuizId(play.quizId);

	if (play && quiz) {
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
	}
}

function sendResult (playId) {
	var data = {};
	var play = getPlayWithPlayId(playId);
	var quiz = play && getQuizWithQuizId(play.quizId);
	var question = quiz && getQuestionWithQuestionId(quiz.questionList[play.currentQuestionIndex]);

	data.playId = playId;
	data.serverStatus = 'RESULT';

	if (play && quiz && question) {
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
	}
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
	var quiz = play && getQuizWithQuizId(play.quizId);

	if (play && quiz) {
		data.playId = playId;
		data.serverStatus = 'PLAY';

		for (var j = 0; j < questions.length; j++) {
			if (questions[j].questionId === quiz.questionList[play.currentQuestionIndex]) {
				data.question = questions[j];
				timeOut = data.question.timer;
			}
		}
		data.timeOut = timeOut

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
				play && clearInterval(play.nextStepTimer);
				play.nextStepTimer =  null;
				sendResult(playId);
			}
		}, 1000);
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

	play && clearInterval(play.nextStepTimer);
	play.nextStepTimer =  null;

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
	var quiz = play && getQuizWithQuizId(play.quizId);
	var question = quiz && getQuestionWithQuestionId(quiz.questionList[play.currentQuestionIndex]);

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
				clearInterval(play.nextStepTimer);
				play.nextStepTimer =  null;
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
