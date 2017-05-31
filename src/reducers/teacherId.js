const initialState = '';

export default function teacherLoginType (state = initialState, action) {
	switch (action.type) {
	case 'SET_TEACHER_ID':
		return action.payload;
	case 'SET_TEACHER_INFO':
		if (action.payload.teacherLoginType === 'facebook') {
			return action.payload.userID;
		} else if (action.payload.teacherLoginType === 'google') {
			return action.payload.googleId;
		}
		return state;
	case 'RESET_TO_MAIN':
		return initialState;
	default:
		return state;
	}
}
