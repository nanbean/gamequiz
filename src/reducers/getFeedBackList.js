const initialState = {
	feedBackList: []
};

export default function getFeedBackList (state = initialState, action) {
	switch (action.type) {
	case 'SET_GET_FEEDBACK_LIST':
		return Object.assign({}, state, action.payload);
	default:
		return state;
	}
}
