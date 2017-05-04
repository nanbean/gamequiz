export default function question (state = {}, action) {
	switch (action.type) {
	case 'SET_QUESTION':
		if (action.payload) {
			return Object.assign({}, state, action.payload);
		}
		return {};
	case 'CLEAR_QUESTION':
		return {};
	default:
		return state;
	}
}
