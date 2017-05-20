export default function quizId (state = '', action) {
	switch (action.type) {
	case 'SET_QUIZ_ID':
		return action.payload;
	case 'SET_ADD_QUIZ':
		return action.payload.quizId;
	default:
		return state;
	}
}
