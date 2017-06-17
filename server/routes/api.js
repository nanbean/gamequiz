const express = require('express');
const fs = require('fs');
const multer = require('multer');
const getServerEventTeacher = require('./sse');
const getServerEvent = require('./sse');
const mongoose = require('mongoose');

const router = express.Router();

const db = mongoose.connection;
db.on('error', console.error);
db.once('open', () => {
	// CONNECTED TO MONGODB SERVER
	console.log('Connected to mongod server');
});

mongoose.connect('mongodb://localhost/gamequiz');

const Teacher = require('./models/teacher');
const Quiz = require('./models/quiz');
const Question = require('./models/question');
const Suggestion = require('./models/suggestion');
const Feedback = require('./models/feedback');

router.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});

router.get('/', (req, res) => {
	res.json({});
});

const plays = [
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

router.post('/teacher/checkTeacher', (req, res) => {
	const teacherId = req.body.teacherId;
	const data = {
		valid: false
	};

	if (teacherId) {
		Teacher.findOne({
			teacherId
		}, (err, teacher) => {
			if (err) {
				console.error(err);
				return res.send(data);
			}

			if (teacher) {
				data.valid = true;
				return res.send(data);
			}

			return res.send(data);
		});
	} else {
		res.send(data);
	}
});

router.post('/teacher/registerTeacher', (req, res) => {
	const teacherId = req.body.teacherId;
	const data = {
		error: '',
		return: false
	};

	if (teacherId) {
		const teacher = new Teacher();
		teacher.teacherId = teacherId;
		teacher.quizList = [];

		teacher.save((err) => {
			if (err) {
				console.error(err);
				data.error = 'DB_ERROR';
				return res.send(data);
			}

			data.return = true;
			return res.send(data);
		});
	} else {
		data.error = 'NO_TEACHER_ID';
		res.send(data);
	}
});

router.post('/teacher/unRegisterTeacher', (req, res) => {
	const teacherId = req.body.teacherId;
	const data = {
		error: '',
		return: false
	};

	if (teacherId) {
		Teacher.remove({
			teacherId
		}, (err, teacher) => {
			if (err) {
				console.error(err);
				return res.send(data);
			}

			if (teacher) {
				data.valid = true;
				return res.send(data);
			}

			return res.send(data);
		});
	} else {
		data.error = 'NO_TEACHER_ID';
		res.send(data);
	}
});


router.post('/teacher/getQuizList', (req, res) => {
	const teacherId = req.body.teacherId;
	const data = {
		return: false,
		quizList: []
	};

	if (teacherId) {
		Teacher.findOne({
			teacherId
		}, (err, teacher) => {
			if (err) {
				console.error(err);
				return res.send(data);
			}

			if (teacher) {
				return Quiz.find({
					_id: {
						$in: teacher.quizList.map(o => (mongoose.Types.ObjectId(o)))
					}
				}, (err2, quizList) => {
					if (err2) {
						console.error(err2);
						return res.send(data);
					}

					data.return = true;
					data.quizList = quizList;
					return res.send(data);
				});
			}

			return res.send(data);
		});
	} else {
		res.send(data);
	}
});

router.post('/teacher/getFeedBackList', (req, res) => {
	const teacherId = req.body.teacherId;
	const data = {
		feedBackList: []
	};

	Feedback.find({
		teacherId
	}, (err, feedBackList) => {
		if (err) {
			return res.send(data);
		}

		data.feedBackList = feedBackList;
		return res.send(data);
	});
});

router.post('/teacher/addQuiz', (req, res) => {
	const teacherId = req.body.teacherId;
	const newQuiz = req.body.quiz;
	const data = {
		return: false
	};

	if (teacherId && newQuiz) {
		const quiz = new Quiz();
		quiz.quizTitle = newQuiz.quizTitle;
		quiz.questionList = newQuiz.questionList;

		quiz.save((err) => {
			if (err) {
				return res.send(data);
			}

			return Teacher.findOne({
				teacherId
			}, (err2, teacher) => {
				if (err2) {
					return res.send(data);
				}

				if (teacher) {
					teacher.quizList.push(quiz._id);

					return teacher.save((err3) => {
						if (err3) {
							return res.send(data);
						}

						data.quizId = quiz._id;
						data.return = true;
						return res.send(data);
					});
				}

				return res.send(data);
			});
		});
	} else {
		res.send(data);
	}
});

router.post('/teacher/editQuiz', (req, res) => {
	const quizModified = req.body.quiz;
	const data = {
		return: false
	};

	Quiz.findById(quizModified._id, (err, quiz) => {
		if (err) {
			return res.send(data);
		}

		const editQuit = quiz;

		editQuit.quizTitle = quizModified.quizTitle;
		editQuit.questionList = quizModified.questionList;

		return editQuit.save((err2) => {
			if (err2) {
				return res.send(data);
			}

			data.return = true;
			return res.send(data);
		});
	});
});

router.post('/teacher/deleteQuiz', (req, res) => {
	const teacherId = req.body.teacherId;
	const quizId = req.body.quizId;
	const data = {
		return: false
	};

	Teacher.findOne({
		teacherId
	}, (err, teacher) => {
		if (err) {
			return res.send(data);
		}

		for (let i = 0; i < teacher.quizList.length; i += 1) {
			if (teacher.quizList[i] === quizId) {
				teacher.quizList.splice(i, 1);
			}
		}

		return teacher.save((err2) => {
			if (err2) {
				return res.send(data);
			}

			return Quiz.remove({
				_id: quizId
			}, (err3) => {
				if (err3) {
					return res.send(data);
				}

				data.return = true;
				return res.send(data);
			});
		});
	});
});

router.post('/teacher/getQuestionList', (req, res) => {
	const quizId = req.body.quizId;
	const data = {
		return: false,
		questionList: []
	};

	if (quizId) {
		Quiz.findById(quizId, (err, quiz) => {
			if (err) {
				return res.send(data);
			}

			if (quiz && quiz.questionList) {
				return Question.find({
					_id: {
						$in: quiz.questionList.map(o => (mongoose.Types.ObjectId(o)))
					}
				}, (err2, questionList) => {
					if (err2) {
						return res.send(data);
					}

					data.return = true;
					data.questionList = questionList;
					return res.send(data);
				});
			}

			return res.send(data);
		});
	} else {
		res.send(data);
	}
});

function updateSuggestions (categories) {
	for (let i = 0; i < categories.length; i += 1) {
		const suggestion = {
			category: categories[i].text
		};

		Suggestion.update(
			{
				category: suggestion.category
			},
			{
				$setOnInsert: suggestion
			},
			{
				upsert: true
			},
			(err, numAffected) => {
				console.log(numAffected);
			}
		);
	}
}

router.post('/teacher/editQuestion', (req, res) => {
	const modifiedQuestion = req.body.question;
	const data = {
		return: false
	};

	if (modifiedQuestion) {
		Question.findById(modifiedQuestion._id, (err, question) => {
			if (err) {
				return res.send(data);
			}

			const editQuestion = question;

			editQuestion.category = modifiedQuestion.category;
			editQuestion.title = modifiedQuestion.title;
			editQuestion.pictureUrl = modifiedQuestion.pictureUrl;
			editQuestion.example1 = modifiedQuestion.example1;
			editQuestion.example2 = modifiedQuestion.example2;
			editQuestion.example3 = modifiedQuestion.example3;
			editQuestion.example4 = modifiedQuestion.example4;
			editQuestion.answer = modifiedQuestion.answer;
			editQuestion.timer = modifiedQuestion.timer;

			return editQuestion.save((err2) => {
				if (err2) {
					return res.send(data);
				}

				updateSuggestions(modifiedQuestion.category);

				data.return = true;
				return res.send(data);
			});
		});
	} else {
		res.send(data);
	}
});

router.post('/teacher/addQuestion', (req, res) => {
	const newQuestion = req.body.question;
	const quizId = req.body.quizId;
	const data = {
		return: false
	};

	if (newQuestion) {
		const question = new Question();
		question.category = newQuestion.category;
		question.title = newQuestion.title;
		question.pictureUrl = newQuestion.pictureUrl;
		question.example1 = newQuestion.example1;
		question.example2 = newQuestion.example2;
		question.example3 = newQuestion.example3;
		question.example4 = newQuestion.example4;
		question.answer = newQuestion.answer;
		question.timer = newQuestion.timer;

		question.save((err) => {
			if (err) {
				return res.send(data);
			}

			return Quiz.findById(quizId, (err2, quiz) => {
				if (err2) {
					return res.send(data);
				}

				if (quiz) {
					quiz.questionList.push(question._id);

					return quiz.save((err3) => {
						if (err3) {
							return res.send(data);
						}

						updateSuggestions(newQuestion.category);

						data.return = true;
						return res.send(data);
					});
				}

				return res.send(data);
			});
		});
	} else {
		res.send(data);
	}
});

router.post('/teacher/deleteQuestion', (req, res) => {
	const quizId = req.body.quizId;
	const questionId = req.body.questionId;
	const data = {
		return: false
	};

	Quiz.findById(quizId, (err, quiz) => {
		if (err) {
			return res.send(data);
		}

		if (quiz && quiz.questionList) {
			for (let i = 0; i < quiz.questionList.length; i += 1) {
				if (quiz.questionList[i] === questionId) {
					quiz.questionList.splice(i, 1);
					break;
				}
			}

			return quiz.save((err2) => {
				if (err2) {
					return res.send(data);
				}

				data.return = true;
				return res.send(data);
			});
		}

		return res.send(data);
	});
});

const upload = multer({
	storage: multer.diskStorage({
		destination: (req, file, callback) => {
			const teacherId = req.params.teacherId;
			const path = `./uploads/${teacherId}`;
			if (!fs.existsSync('./uploads')) {
				fs.mkdirSync('./uploads');
			}
			if (!fs.existsSync(path)) {
				fs.mkdirSync(path);
			}
			callback(null, path);
		},
		filename: (req, file, callback) => {
			callback(null, file.originalname);
		}
	})
});

router.post('/teacher/uploadImage/:teacherId', upload.any(), (req, res) => {
	res.status(200).send({
		path: req.files[0].path
	});
});

router.post('/teacher/getTagSuggestions', (req, res) => {
	const data = {
		suggestions: []
	};

	Suggestion.find({}, (err, suggestions) => {
		data.suggestions = [...new Set(suggestions.map(o => (o.category)))];
		res.send(data);
	});
});

function startGameMode (teacherId, quizId, gameMode) {
	const playId = Math.floor((Math.random() * 10000) + 1).toString();

	plays.push({
		playId,
		teacherId,
		quizId,
		gameMode,
		status: 'INIT_WAIT',
		studentPlayerList: [],
		survivors: [],
		currentQuestionIndex: 0
	});

	return {
		playId,
		gameMode
	};
}

router.post('/teacher/startGameMode', (req, res) => {
	const teacherId = req.body.teacherId;
	const quizId = req.body.quizId;
	const gameMode = req.body.gameMode;
	const data = startGameMode(teacherId, quizId, gameMode);

	res.send(data);
});

function getPlayWithPlayId (playId) {
	for (let i = 0; i < plays.length; i += 1) {
		if (plays[i].playId === playId) {
			return plays[i];
		}
	}

	return null;
}

function deletePlayWithPlayId (playId) {
	for (let i = 0; i < plays.length; i += 1) {
		if (plays[i].playId === playId) {
			plays.splice(i, 1);
		}
	}
}

function updateFeedbackAndDeletePlay (playId) {
	const play = getPlayWithPlayId(playId);
	for (let i = 0; i < play.studentPlayerList.length; i += 1) {
		const player = play.studentPlayerList[i];
		const wrongQuestions = [];

		if (player && player.answerList) {
			for (let j = 0; j < player.answerList.length; j += 1) {
				if (player.answerList[j].correct === false) {
					wrongQuestions.push(player.answerList[j].questionId);
				}
			}

			Feedback.update(
				{
					studentName: player.studentName,
					teacherId: play.teacherId
				},
				{
					$push: {
						wrongQuestions: {
							$each: wrongQuestions
						}
					},
					$set: {
						lastPlayId: playId,
						lastWrongQuestions: wrongQuestions
					}
				},
				{
					upsert: true
				},
				() => {
					if (i >= play.studentPlayerList.length - 1) {
						deletePlayWithPlayId(playId);
					}
				}
			);
		}
	}
}

function sendLeaderBoard (playId) {
	const data = {};
	const play = getPlayWithPlayId(playId);
	const quizId = play && play.quizId;

	if (play && quizId) {
		let i;
		let j;

		Quiz.findById(quizId, (err, quiz) => {
			if (err) {
				console.error(err);
			}

			data.playId = playId;
			data.leaderBoard = [];

			if (play.gameMode === 'SURVIVAL') {
				data.survivors = play.survivors.map(student => ({
					studentId: student.studentId,
					studentNick: student.studentNick
				}));
			}

			if (play.currentQuestionIndex >= quiz.questionList.length - 1 || (play.gameMode === 'SURVIVAL' && data.survivors.length < 1)) {
				data.serverStatus = 'END';

				play.status = 'END';

				for (i = 0; i < play.studentPlayerList.length; i += 1) {
					const student = {};
					const answerList = play.studentPlayerList[i].answerList;
					student.studentId = play.studentPlayerList[i].studentId;
					student.studentNick = play.studentPlayerList[i].studentNick;
					student.score = 0;

					console.log(`student.studentNick: ${student.studentNick}`);

					if (answerList) {
						for (j = 0; j < answerList.length; j += 1) {
							console.log(`score ${j} : ${play.studentPlayerList[i].answerList[j].score}`);
							student.score = parseInt(
								student.score + play.studentPlayerList[i].answerList[j].score,
								10
							);
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

				for (i = 0; i < play.studentPlayerList.length; i += 1) {
					const student = {};
					const answerList = play.studentPlayerList[i].answerList;

					student.studentId = play.studentPlayerList[i].studentId;
					student.studentNick = play.studentPlayerList[i].studentNick;
					student.score = 0;

					console.log(`student.studentNick: ${student.studentNick}`);

					if (answerList) {
						for (j = 0; j < answerList.length; j += 1) {
							console.log(`score ${j} : ${play.studentPlayerList[i].answerList[j].score}`);
							student.score = parseInt(
								student.score + play.studentPlayerList[i].answerList[j].score,
								10
							);
						}
					}

					data.leaderBoard.push(student);
				}
			}

			data.leaderBoard = data.leaderBoard.sort((a, b) => (b.score - a.score));

			if (play.previousRank) {
				let maxRank = 3;
				let k;
				let q;

				if (play.studentPlayerList.length < maxRank) {
					maxRank = play.studentPlayerList.length;
				}

				for (k = 0; k < maxRank; k += 1) {
					let newRanker = true;
					let rocket = true;
					for (q = 0; q < maxRank; q += 1) {
						if (data.leaderBoard[k].studentId === play.previousRank[q].studentId) {
							newRanker = false;
						}
					}

					if (!newRanker) {
						for (q = 0; q <= k; q += 1) {
							if (data.leaderBoard[k].studentId === play.previousRank[q].studentId) {
								rocket = false;
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
	const data = {};
	const play = getPlayWithPlayId(playId);
	const quizId = play && play.quizId;

	data.playId = playId;
	data.serverStatus = 'RESULT';

	play.status = 'RESULT';

	if (play && quizId) {
		Quiz.findById(quizId, (err, quiz) => {
			if (err) {
				console.error(err);
			}

			const questionId = quiz.questionList[play.currentQuestionIndex];

			for (let k = 0; k < play.studentPlayerList.length; k += 1) {
				if (play.studentPlayerList[k].answerList.length < play.currentQuestionIndex + 1) {
					play.studentPlayerList[k].answerList.push({
						questionId,
						answer: -1,
						correct: false,
						score: 0
					});
				}
			}

			Question.findById(questionId, (err2, question) => {
				if (err2) {
					console.error(err2);
				}

				data.result = {
					answer: question.answer,
					example1: 0,
					example2: 0,
					example3: 0,
					example4: 0
				};

				for (let i = 0; i < play.studentPlayerList.length; i += 1) {
					const answerList = play.studentPlayerList[i].answerList;
					if (answerList && answerList[play.currentQuestionIndex] &&
						answerList[play.currentQuestionIndex].answer === 1) {
						data.result.example1 += 1;
					} else if (answerList && answerList[play.currentQuestionIndex] &&
						answerList[play.currentQuestionIndex].answer === 2) {
						data.result.example2 += 1;
					} else if (answerList && answerList[play.currentQuestionIndex] &&
						answerList[play.currentQuestionIndex].answer === 3) {
						data.result.example3 += 1;
					} else if (answerList && answerList[play.currentQuestionIndex] &&
						answerList[play.currentQuestionIndex].answer === 4) {
						data.result.example4 += 1;
					}
				}

				if (play.gameMode === 'SURVIVAL') {
					data.result.survivors = play.survivors.map(student => ({
						studentId: student.studentId,
						studentNick: student.studentNick
					}));
				}

				getServerEvent.publish(JSON.stringify(data));
				getServerEventTeacher.publish(JSON.stringify(data));

				play.nextStepTimer = setTimeout(() => {
					sendLeaderBoard(playId);
					play.nextStepTimer = null;
				}, 5000);
			});
		});
	}
}

function sendWait (playId) {
	const play = getPlayWithPlayId(playId);
	const data = {};

	data.playId = playId;
	data.serverStatus = 'WAIT';

	play.status = 'WAIT';

	getServerEvent.publish(JSON.stringify(data));
	getServerEventTeacher.publish(JSON.stringify(data));
}

function sendQuetion (playId) {
	const data = {};
	let timeOut;
	const play = getPlayWithPlayId(playId);

	if (play) {
		Quiz.findById(play.quizId, (err, quiz) => {
			if (err) {
				console.error(err);
			}
			if (quiz) {
				data.playId = playId;
				data.serverStatus = 'PLAY';

				play.status = 'PLAY';

				Question.findById(quiz.questionList[play.currentQuestionIndex], (err2, question) => {
					if (err2) {
						console.error(err2);
					}

					if (!question) {
						console.log(`play.currentQuestionIndex: ${play.currentQuestionIndex}`);
						console.log(`quiz.questionList[play.currentQuestionIndex]: ${quiz.questionList[play.currentQuestionIndex]}`);
					}

					data.question = question;
					timeOut = question.timer;
					data.timeOut = question.timer;

					play.presentationTime = new Date();
					play.timeOut = timeOut;

					getServerEvent.publish(JSON.stringify(data));
					getServerEventTeacher.publish(JSON.stringify(data));

					play.nextStepTimer = setInterval(() => {
						timeOut -= 1;
						data.timeOut = timeOut;
						if (timeOut >= 0) {
							getServerEvent.publish(JSON.stringify(data));
							getServerEventTeacher.publish(JSON.stringify(data));
						} else {
							if (play && play.nextStepTimer) {
								clearInterval(play.nextStepTimer);
								play.nextStepTimer = null;
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
	const play = getPlayWithPlayId(playId);

	sendWait(playId);

	play.nextStepTimer = setTimeout(() => {
		sendQuetion(playId);
		play.nextStepTimer = null;
	}, 2000);
}

router.post('/teacher/nextPlayQuestion', (req, res) => {
	const playId = req.body.playId;
	const play = getPlayWithPlayId(playId);
	const data = {
		return: true
	};

	if (!play.nextStepTimer) {
		play.currentQuestionIndex += 1;
		sendWait(playId);

		play.nextStepTimer = setTimeout(() => {
			sendQuetion(playId);
			play.nextStepTimer = null;
		}, 2000);
	}

	res.send(data);
});

router.post('/teacher/startPlay', (req, res) => {
	const playId = req.body.playId;
	const data = {
		return: true
	};

	// this is for test only
	// TO DO: need to add game send
	// TO DO: need to add gmae leader board
	startPlay(playId);

	res.send(data);
});

function terminatePlay (playId) {
	const data = {};
	const play = getPlayWithPlayId(playId);

	data.playId = playId;
	data.leaderBoard = [];
	data.serverStatus = 'END';

	getServerEvent.publish(JSON.stringify(data));

	if (play && play.nextStepTimer) {
		clearInterval(play.nextStepTimer);
		play.nextStepTimer = null;
	}

	deletePlayWithPlayId(playId);
}

function outputGetServerEventTeacherSSE (req, res, data) {
	res.write(data);
	if (res.flush && data.match(/\n\n$/)) {
		res.flush();
	}
}

function ServerEvent () {
	this.data = '';
}

function initialiseGetServerEventTeacherSSE (req, res) {
	const playId = req.query.playId;

	const subscriber = getServerEventTeacher.subscribe((channel, message) => {
		const messageEvent = new ServerEvent();
		messageEvent.addData(message);
		outputGetServerEventTeacherSSE(req, res, messageEvent.payload());
	});

	res.set({
		'Content-Type': 'text/event-stream',
		'Cache-Control': 'no-cache',
		'Connection': 'keep-alive',
		'Access-Control-Allow-Origin': '*'
	});

	res.write('retry: 10000\n\n');

	const keepAlive = setInterval(() => {
		outputGetServerEventTeacherSSE(req, res, ':keep-alive\n\n');
	}, 20000);

	res.on('close', () => {
		if (keepAlive) {
			clearInterval(keepAlive);
		}
		terminatePlay(playId);
		getServerEventTeacher.unsubscribe(subscriber);
	});
}

ServerEvent.prototype.addData = function addData (data) {
	const lines = data.split(/\n/);

	for (let i = 0; i < lines.length; i += 1) {
		const element = lines[i];
		this.data += `data:${element}\n`;
	}
};

ServerEvent.prototype.payload = function payload () {
	let payloads = '';

	payloads += this.data;
	return `${payloads}\n`;
};

router.get('/teacher/getServerEventTeacher', (req, res) => {
	initialiseGetServerEventTeacherSSE(req, res);

	getServerEventTeacher.publish(JSON.stringify({
		serverStatus: 'WAIT'
	}));
});

router.post('/student/checkPlayId', (req, res) => {
	const playId = req.body.playId;
	const play = playId && getPlayWithPlayId(playId);
	const data = {};

	if (getPlayWithPlayId(playId)) {
		if (play.status === 'INIT_WAIT') {
			data.valid = true;
		}
	} else {
		data.valid = false;
	}

	res.send(data);
});

function addStudentPalyer (playId, student) {
	const play = getPlayWithPlayId(playId);

	if (play) {
		play.studentPlayerList.push(student);
		play.survivors.push(student);

		if (play.status === 'INIT_WAIT') {
			getServerEventTeacher.publish(JSON.stringify(play));
		}
	}
}

router.post('/student/sendStudentInfo', (req, res) => {
	const studentNick = req.body.studentNick;
	const studentName = req.body.studentName;
	const playId = req.body.playId;
	const play = playId && getPlayWithPlayId(playId);
	const data = {
		return: false
	};

	if (play && play.status === 'INIT_WAIT') {
		data.playId = playId;
		data.studentId = Math.floor((Math.random() * 10000) + 1);
		data.studentNick = studentNick;
		data.studentName = studentName;
		data.answerList = [];

		addStudentPalyer(playId, data);
		data.return = true;
	}

	res.send(data);
});

router.post('/student/getLastFeedBackList', (req, res) => {
	const studentName = req.body.studentName;
	const playId = req.body.playId;
	const data = {
		feedBackList: [],
		questionList: []
	};

	if (playId && studentName) {
		Feedback.findOne({
			lastPlayId: playId,
			studentName
		}, (err, feedBackList) => {
			if (err) {
				return res.send(data);
			}

			if (feedBackList && feedBackList.lastWrongQuestions) {
				data.feedBackList = feedBackList;

				return Question.find({
					_id: {
						$in: feedBackList.lastWrongQuestions.map(o => (mongoose.Types.ObjectId(o)))
					}
				}, (err2, questions) => {
					if (err2) {
						console.error(err2);
					}

					if (questions) {
						data.questionList = questions;
						res.send(data);
					} else {
						res.send(data);
					}
				});
			}

			return res.send(data);
		});
	} else {
		res.send(data);
	}
});

function calculateScore (playTimeOut, presentationTime, answerTime) {
	const elapsedTime = answerTime - presentationTime;
	let score = (playTimeOut * 25) - ((elapsedTime / 1000) * 25);
	// 25 is temporary number

	if (score < 0) {
		score = 0;
	}

	return score;
}

function updateAnswerToPlay (playId, studentId, answer) {
	const play = getPlayWithPlayId(playId);
	const quizId = play && play.quizId;

	if (play && quizId) {
		Quiz.findById(quizId, (err, quiz) => {
			if (err) {
				console.error(err);
			}

			const questionId = quiz && quiz.questionList[play.currentQuestionIndex];

			if (questionId) {
				Question.findById(quiz.questionList[play.currentQuestionIndex], (err2, question) => {
					if (err) {
						console.error(err2);
					}

					if (question) {
						let i;

						if (play.gameMode === 'SURVIVAL') {
							if (question.answer !== answer) {
								for (i = 0; i < play.survivors.length; i += 1) {
									if (play.survivors[i].studentId === studentId) {
										play.survivors.splice(i, 1);
									}
								}
							}
						}

						for (i = 0; i < play.studentPlayerList.length; i += 1) {
							if (play.studentPlayerList[i].studentId === studentId) {
								if (!play.studentPlayerList[i].answerList) {
									play.studentPlayerList[i].answerList = [];
								}

								play.studentPlayerList[i].answerList.push({
									questionId: question._id,
									answer,
									correct: question.answer === answer,
									score: question.answer === answer ?
													calculateScore(play.timeOut, play.presentationTime, new Date()) : 0
								});
							}
						}
					}
				});
			}
		});
	}
}

router.post('/student/sendStudentAnswer', (req, res) => {
	const playId = req.body.playId;
	const studentId = req.body.studentId;
	const answer = req.body.answer;

	const data = {
		return: true
	};

	updateAnswerToPlay(playId, studentId, answer);

	res.send(data);
});

function removeStudentFromPlay (playId, studentId) {
	const play = getPlayWithPlayId(playId);

	if (play) {
		for (let i = 0; i < play.studentPlayerList.length; i += 1) {
			if (play.studentPlayerList[i].studentId === studentId) {
				play.studentPlayerList.splice(i, 1);
				// if (play && play.nextStepTimer) {
				// 	clearInterval(play.nextStepTimer);
				// 	play.nextStepTimer =  null;
				// }

				if (play.status === 'INIT_WAIT') {
					getServerEventTeacher.publish(JSON.stringify(play));
				}
				return;
			}
		}
	}
}

function outputGetServerEventSSE (req, res, data) {
	res.write(data);
	if (res.flush && data.match(/\n\n$/)) {
		res.flush();
	}
}

function initialiseGetServerEventSSE (req, res) {
	const playId = req.query.playId;
	const studentId = req.query.studentId;

	const subscriber = getServerEvent.subscribe((channel, message) => {
		const messageEvent = new ServerEvent();
		messageEvent.addData(message);
		outputGetServerEventSSE(req, res, messageEvent.payload());
	});

	res.set({
		'Content-Type': 'text/event-stream',
		'Cache-Control': 'no-cache',
		'Connection': 'keep-alive',
		'Access-Control-Allow-Origin': '*'
	});

	res.write('retry: 10000\n\n');

	const keepAlive = setInterval(() => {
		outputGetServerEventSSE(req, res, ':keep-alive\n\n');
	}, 20000);

	res.on('close', () => {
		if (keepAlive) {
			clearInterval(keepAlive);
		}
		getServerEvent.unsubscribe(subscriber);
		removeStudentFromPlay(playId, studentId);
	});
}

router.get('/getServerEvent', (req, res) => {
	const data = {};
	const playId = req.query.playId;
	initialiseGetServerEventSSE(req, res);

	data.playId = playId;
	data.serverStatus = 'WAIT';

	getServerEvent.publish(JSON.stringify(data));
});

module.exports = router;
