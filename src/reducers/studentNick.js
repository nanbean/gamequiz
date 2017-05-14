export default function studentNick (state = '', action) {
	switch (action.type) {
	case 'SET_STUDENT_NICK':
	case 'SET_SEND_STUDENT_INFO':
		return action.payload.studentNick;
	default:
		return state;
	}
}
