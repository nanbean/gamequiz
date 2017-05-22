export default function teacherName (state = '', action) {
	switch (action.type) {
	case 'SET_TEACHER_INFO':
		if (action.payload.teacherLoginType === 'facebook') {
			return action.payload.name;
		} else if (action.payload.teacherLoginType === 'google') {
			if (action.payload.profileObj) {
				return action.payload.profileObj.name;
			}
		}
		return state;
	default:
		return state;
	}
}
