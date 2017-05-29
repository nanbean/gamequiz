const initialState = 'main';

export default function studentPage (state = initialState, action) {
	switch (action.type) {
	case 'RESET_TO_HOME':
		return initialState;
	case 'SET_PLAY_ID_CHECK':
		if (state === 'main' && action.payload === 'valid') {
			return 'login';
		}
		return state;
	case 'SET_SEND_STUDENT_INFO':
		if (state === 'login' && action.payload.studentId > 0) {
			return 'play';
		}
		return state;
	case 'SET_SERVER_STATUS':
		if (action.payload.serverStatus === 'END') {
			return 'end';
		} else if (state === 'play' && action.payload.survived === false) {
			return 'end';
		}
		return state;
	default:
		return state;
	}
}
