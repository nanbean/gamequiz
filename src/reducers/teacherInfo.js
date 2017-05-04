export default function teacherInfo (state = {}, action) {
	switch (action.type) {
	case 'SET_TEACHER_INFO':
		return Object.assign({}, state, action.payload);
	default:
		return state;
	}
}
