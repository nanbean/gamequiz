export default function checkTeacher (state = {}, action) {
	switch (action.type) {
		case 'SET_CHECK_TEACHER':
			return Object.assign({}, state, action.payload);
		default:
			return state;
	}
}
