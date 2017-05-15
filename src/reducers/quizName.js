export default function quizName (state = '', action) {
	switch (action.type) {
	case 'SET_QUIZ_NAME':
		return action.payload;
	default:
		return state;
	}
}
