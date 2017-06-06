export default function wrongQuestions (state = [], action) {
	switch (action.type) {
	case 'SET_GET_LAST_FEEDBACK_LIST':
		return action.payload.questionList;
	default:
		return state;
	}
}
