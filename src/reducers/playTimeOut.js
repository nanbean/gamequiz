export default function playTimeOut (state = -1, action) {
	switch (action.type) {
	case 'SET_PLAY_TIME_OUT':
		return action.payload.timeOut;
	default:
		return state;
	}
}
