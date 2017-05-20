const initialState = '';

export default function playId (state = initialState, action) {
	switch (action.type) {
	case 'RESET_TO_HOME':
		return initialState;
	case 'SET_PLAY_ID':
	case 'SET_PLAY_ID_N_GAMEMODE':
		return action.payload.playId;
	default:
		return state;
	}
}
