export default function quizId (state = -1, action) {
	switch (action.type) {
	case 'SET_QUIZ_ID':
		return action.payload;
	default:
		return state;
	}
}
