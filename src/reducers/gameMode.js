export default function gameMode (state = '', action) {
	switch (action.type) {
	case 'SET_GAME_MODE':
	case 'SET_PLAY_ID_N_GAMEMODE':
		return action.payload.gameMode;
	default:
		return state;
	}
}
