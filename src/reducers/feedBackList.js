export default function feedBackList (state = [], action) {
	switch (action.type) {
	case 'SET_GET_FEEDBACK_LIST':
		return action.payload.feedBackList;
	default:
		return state;
	}
}
