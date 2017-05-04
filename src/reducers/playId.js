export default function playId (state = -1, action) {
	switch (action.type) {
	case 'SET_PLAY_ID':
	case 'SET_PLAY_ID_N_GAMEMODE':
		return action.payload.playId;
	default:
		return state;
	}
}
