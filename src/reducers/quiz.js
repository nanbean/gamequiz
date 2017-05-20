export default function quiz (state = {}, action) {
	switch (action.type) {
	case 'SET_QUIZ':
		if (action.payload) {
			return Object.assign({}, state, action.payload);
		}
		return {};
	case 'SET_ADD_QUIZ':
	case 'CLEAR_QUIZ':
		return {};
	default:
		return state;
	}
}
