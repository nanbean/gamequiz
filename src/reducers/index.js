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
	getQuestionList
});

export default gamequiz;
