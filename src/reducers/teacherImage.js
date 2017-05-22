export default function teacherImage (state = '', action) {
	switch (action.type) {
	case 'SET_TEACHER_INFO':
		if (action.payload.teacherLoginType === 'facebook') {
			if (action.payload.picture && action.payload.picture.data) {
				return action.payload.picture.data.url;
			}
		} else if (action.payload.teacherLoginType === 'google') {
			if (action.payload.profileObj) {
				return action.payload.profileObj.imageUrl;
			}
		}
		return state;
	default:
		return state;
	}
}
