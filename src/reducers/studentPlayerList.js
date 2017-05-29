const initialState = [];

export default function studentPlayerList (state = initialState, action) {
	switch (action.type) {
	case 'SET_STUDENT_PLAYER_LIST':
		return action.payload.studentPlayerList;
	case 'RESET_TO_HOME':
		return initialState;
	default:
		return state;
	}
}
