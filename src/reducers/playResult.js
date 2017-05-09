export default function playResult (state = {}, action) {
	switch (action.type) {
	case 'SET_PLAY_RESULT':
		if (action.payload.result) {
			return Object.assign({}, state, action.payload.result);
		}
		return {};
	default:
		return state;
	}
}
