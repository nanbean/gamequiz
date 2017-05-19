const initialState = 'main';

export default function studentPage (state = initialState, action) {
	switch (action.type) {
	case 'RESET_TO_HOME':
		return initialState;
	case 'SET_CHECK_PLAY_ID':
		if (state === 'main' && action.payload.valid === true) {
			return 'login';
		}
		return state;
	case 'SET_SEND_STUDENT_INFO':
		if (state === 'login' && action.payload.studentId > 0) {
			return 'play';
		}
		return state;
	default:
		return state;
	}
}
