import { combineReducers } from 'redux';
import playId from './playId';
import checkTeacher from './checkTeacher';
import registerTeacher from './registerTeacher';
import getQuizList from './getQuizList';
import feedBackList from './feedBackList';
import getQuestionList from './getQuestionList';
import quizId from './quizId';
import quizName from './quizName';
import newQuizId from './newQuizId';
import quiz from './quiz';
import question from './question';
import tagSuggestions from './tagSuggestions';
import gameMode from './gameMode';
import studentNick from './studentNick';
import studentName from './studentName';
import studentId from './studentId';
import studentPlayerList from './studentPlayerList';
import studentPage from './studentPage';
import serverStatus from './serverStatus';
import playQuestion from './playQuestion';
import playTimeOut from './playTimeOut';
import playResult from './playResult';
import playLeaderBoard from './playLeaderBoard';
import studentAnswered from './studentAnswered';
import teacherLoginType from './teacherLoginType';
import teacherId from './teacherId';
import teacherName from './teacherName';
import teacherImage from './teacherImage';
import playIdCheck from './playIdCheck';
import survivor from './survivor';
import playSurvivors from './playSurvivors';
import wrongQuestions from './wrongQuestions';

const gamequiz = combineReducers({
	playId,
	gameMode,
	quizId,
	quizName,
	newQuizId,
	quiz,
	question,
	tagSuggestions,
	checkTeacher,
	registerTeacher,
	getQuizList,
	feedBackList,
	getQuestionList,
	studentId,
	studentName,
	studentNick,
	studentPlayerList,
	studentPage,
	studentAnswered,
	serverStatus,
	playQuestion,
	playTimeOut,
	playResult,
	playLeaderBoard,
	teacherLoginType,
	teacherId,
	teacherName,
	teacherImage,
	playIdCheck,
	survivor,
	playSurvivors,
	wrongQuestions
});

export default gamequiz;
