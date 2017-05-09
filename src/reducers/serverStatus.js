export default function serverStatus (state = '', action) {
	switch (action.type) {
	case 'SET_SERVER_STATUS':
		return action.payload.serverStatus;
	default:
		return state;
	}
}
