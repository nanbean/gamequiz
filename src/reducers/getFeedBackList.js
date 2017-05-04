export default function getFeedBackList (state = [], action) {
	switch (action.type) {
	case 'SET_GET_FEEDBACK_LIST':
		return action.payload;
	default:
		return state;
	}
}
