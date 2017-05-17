export default function newQuizId (state = -1, action) {
	switch (action.type) {
	case 'SET_ADD_QUIZ':
		return action.payload.quizId;
	default:
		return state;
	}
}
