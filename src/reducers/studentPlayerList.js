export default function studentPlayerList (state = [], action) {
	switch (action.type) {
	case 'SET_STUDENT_PLAYER_LIST':
		return action.payload.studentPlayerList;
	default:
		return state;
	}
}
