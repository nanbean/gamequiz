export default function getQuestionList (state = [], action) {
	switch (action.type) {
	case 'SET_GET_QUESTION_LIST':
		return action.payload;
	default:
		return state;
	}
}
