const express = require('express')
const router = express.Router()
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

var quiz = [
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
			3,
			4,
			5,
			6
		]
	}
];

var questions = [
	{
		questionId: 0,
		quizCategory: [
			'덧셈',
			'산수'
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
			'곱셈',
			'산수'
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
		questionId: 2,
		quizCategory: [
			'지리',
			'나라',
			'수도'
		],
		title: '대한민국의 수도는?',
		pictureUrl: '',
		example1: '서울',
		example2: '부산',
		example3: '대구',
		example4: '광주',
		answer: 1,
		timer: 20
	},
	{
		questionId: 3,
		quizCategory: [
			'달력',
			'생활'
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
			'덧셈',
			'산수'
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
			'곱셈',
			'산수'
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
			'지리',
			'나라',
			'수도'
		],
		title: '대한민국의 수도는?',
		pictureUrl: '',
		example1: '서울',
		example2: '부산',
		example3: '대구',
		example4: '광주',
		answer: 1,
		timer: 20
	},
	{
		questionId: 7,
		quizCategory: [
			'달력',
			'생활'
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

function checkUserExist (teacherId) {
	for (var i = 0; i < teacher.length; i++) {
		console.log(teacher[i].teacherId);
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
				console.log(quiz[teacher[i].quizList[j]]);
				result.push(quiz[teacher[i].quizList[j]]);
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

	for (var i = 0; i < quiz.length; i++) {
		if (quiz[i].quizId == quizId) {
			for (var j = 0; j < quiz[i].questionList.length; j++) {
				result.push(questions[quiz[i].questionList[j]]);
			}
			break;
		}
	}

	return result;
}

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
	for (var i = 0; i < quiz.length; i++) {
		if (quiz[i].quizId == quizId) {
			quiz[i].questionList.push(questionId);
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

function startGameMode (quizId, gameMode) {
	var playId = -1;

	playId = 1234;

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

module.exports = router
