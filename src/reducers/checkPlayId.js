export default function checkPlayId (state = {}, action) {
	switch (action.type) {
	case 'SET_CHECK_PLAY_ID':
		return Object.assign({}, state, action.payload);
	default:
		return state;
	}
}
