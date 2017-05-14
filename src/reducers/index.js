import { combineReducers } from 'redux';
import playId from './playId';
import teacherInfo from './teacherInfo';
import checkTeacher from './checkTeacher';
import registerTeacher from './registerTeacher';
import getQuizList from './getQuizList';
import getFeedBackList from './getFeedBackList';
import getQuestionList from './getQuestionList';
import quizId from './quizId';
import question from './question';
import gameMode from './gameMode';
import checkPlayId from './checkPlayId';
import studentNick from './studentNick';
import studentId from './studentId';
import studentPlayerList from './studentPlayerList';
import studentPage from './studentPage';
import serverStatus from './serverStatus';
import playQuestion from './playQuestion';
import playTimeOut from './playTimeOut';
import playResult from './playResult';
import playLeaderBoard from './playLeaderBoard';
import studentAnswered from './studentAnswered';

const gamequiz = combineReducers({
	playId,
	gameMode,
	quizId,
	question,
	teacherInfo,
	checkTeacher,
	registerTeacher,
	getQuizList,
	getFeedBackList,
	getQuestionList,
	checkPlayId,
	studentId,
	studentNick,
	studentPlayerList,
	studentPage,
	studentAnswered,
	serverStatus,
	playQuestion,
	playTimeOut,
	playResult,
	playLeaderBoard
});

export default gamequiz;
