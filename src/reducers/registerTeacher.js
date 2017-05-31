export default function registerTeacher (state = {}, action) {
	switch (action.type) {
	case 'SET_REGISTER_TEACHER':
		return Object.assign({}, state, action.payload);
	case 'RESET_TO_MAIN':
		return {};
	default:
		return state;
	}
}
