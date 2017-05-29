export default function playSurvivors (state = [], action) {
	switch (action.type) {
	case 'SET_SERVER_STATUS':
		if (typeof action.payload.survivors !== 'undefined') {
			return action.payload.survivors;
		}
		return [];
	default:
		return state;
	}
}
