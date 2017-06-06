export default function studentName (state = '', action) {
	switch (action.type) {
	case 'SET_STUDENT_NAME':
	case 'SET_SEND_STUDENT_INFO':
		return action.payload.studentName;
	default:
		return state;
	}
}
