const initialState = {
	questionId: -1,
	category: [],
	title: '',
	pictureUrl: '',
	example1: '',
	example2: '',
	example3: '',
	example4: '',
	answer: -1,
	timer: 20
};

export default function question (state = initialState, action) {
	switch (action.type) {
	case 'SET_QUESTION':
		if (action.payload) {
			return action.payload;
		}
		return initialState;
	case 'CLEAR_QUESTION':
		return initialState;
	case 'SET_IMAGE_UPLOAD':
		if (action.payload) {
			return Object.assign({}, state, action.payload);
		}
		return {};
	default:
		return state;
	}
}
