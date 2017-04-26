import {combineReducers} from 'redux'
import play from './play'
import teacherInfo from './teacherInfo'
import checkTeacher from './checkTeacher'
import registerTeacher from './registerTeacher'
import getQuizList from './getQuizList'
import getFeedBackList from './getFeedBackList'

const gamequiz = combineReducers({
	play,
	teacherInfo,
	checkTeacher,
	registerTeacher,
	getQuizList,
	getFeedBackList
})

export default gamequiz
