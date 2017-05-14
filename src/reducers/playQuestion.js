export default function playQuestion (state = {}, action) {
	switch (action.type) {
	case 'SET_PLAY_QUESTION':
		if (action.payload.question) {
			return Object.assign({}, state, action.payload.question);
		}
		return {};
	default:
		return state;
	}
}
