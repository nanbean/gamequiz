export default function getQuizList (state = [], action) {
	switch (action.type) {
	case 'SET_GET_QUIZ_LIST':
		return action.payload;
	default:
		return state;
	}
}
