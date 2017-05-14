export default function studentAnswered (state = false, action) {
	switch (action.type) {
	case 'SET_STUDENT_ANSWERED':
		return action.payload.return;
	case 'SET_SERVER_STATUS':
		if (action.payload.serverStatus !== 'PLAY') {
			return false;
		}
		return state;
	default:
		return state;
	}
}
