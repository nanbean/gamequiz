export default function studentPage (state = 'main', action) {
	switch (action.type) {
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
