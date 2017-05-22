const initialState = '';

export default function playIdCheck (state = initialState, action) {
	switch (action.type) {
	case 'SET_PLAY_ID_CHECK':
		return action.payload;
	default:
		return state;
	}
}
