export default function checkTeacher (state = {}, action) {
	switch (action.type) {
	case 'SET_CHECK_TEACHER':
		return Object.assign({}, state, action.payload);
	case 'RESET_TO_MAIN':
		return {};
	default:
		return state;
	}
}
