export default function studentId (state = -1, action) {
	switch (action.type) {
	case 'SET_STUDENT_ID':
	case 'SET_SEND_STUDENT_INFO':
		return action.payload.studentId;
	default:
		return state;
	}
}
