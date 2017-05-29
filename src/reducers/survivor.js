const initialState = true;

export default function question (state = initialState, action) {
	switch (action.type) {
	case 'SET_SERVER_STATUS':
		if (action.payload.survived === true) {
			return true;
		} else if (action.payload.survived === false) {
			return false;
		}

		return state;
	case 'RESET_TO_HOME':
		return initialState;
	default:
		return state;
	}
}
