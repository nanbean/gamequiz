const initialState = '';

export default function teacherLoginType (state = initialState, action) {
	switch (action.type) {
	case 'SET_TEACHER_LOGIN_TYPE':
		return action.payload;
	case 'SET_TEACHER_INFO':
		return action.payload.teacherLoginType;
	default:
		return state;
	}
}
