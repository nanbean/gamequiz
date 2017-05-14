export default function playLeaderBoard (state = [], action) {
	switch (action.type) {
	case 'SET_PLAY_LEADER_BOARD':
		if (action.payload.leaderBoard) {
			return action.payload.leaderBoard;
		}
		return {};
	default:
		return state;
	}
}
