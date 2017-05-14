export default function question (state = {}, action) {
	switch (action.type) {
	case 'SET_QUESTION':
		if (action.payload) {
			return Object.assign({}, state, action.payload);
		}
		return {};
	case 'CLEAR_QUESTION':
		return {};
	case 'SET_IMAGE_UPLOAD':
		if (action.payload) {
			return Object.assign({}, state, action.payload);
		}
		return {};
	default:
		return state;
	}
}
