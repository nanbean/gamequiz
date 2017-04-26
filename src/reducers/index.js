import {combineReducers} from 'redux'
import play from './play'
import teacherInfo from './teacherInfo'
import checkTeacher from './checkTeacher'
import registerTeacher from './registerTeacher'

const gamequiz = combineReducers({
	play,
	teacherInfo,
	checkTeacher,
	registerTeacher
})

export default gamequiz
