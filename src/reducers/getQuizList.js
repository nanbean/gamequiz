export default function getQuizList (state = {}, action) {
	switch (action.type) {
	case 'SET_GET_QUIZ_LIST':
		return Object.assign({}, state, action.payload);
	default:
		return state;
	}
}
