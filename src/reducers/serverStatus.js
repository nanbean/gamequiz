export default function serverStatus (state = '', action) {
	switch (action.type) {
	case 'SET_SERVER_STATUS':
		if (action.payload.serverStatus) {
			return action.payload.serverStatus;
		}
		return state;
	default:
		return state;
	}
}
