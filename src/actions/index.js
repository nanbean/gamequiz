function fetchCall (call, params) {
	return fetch(call, {
		method: 'post',
		headers: {
			'Accept': 'application/json, text/plain, */*',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(params)
	});
}

export const checkTeacher = params => dispatch => {
		return fetchCall('/teacher/checkTeacher', params).then(
			response => {return response.json()}
		).then(
			result => {
				dispatch({
					type: 'SET_CHECK_TEACHER',
					payload: result
				});
			}
		);
};

export const setTeacherInfo = params => dispatch => {
	if (params.userID) {
		dispatch(checkTeacher({facebookUserID: params.userID}));
	}

	dispatch({
		type: 'SET_TEACHER_INFO',
		payload: params
	});
};

export const callRegisterTeacher = params => dispatch => {
		return fetchCall('/teacher/registerTeacher', params).then(
			response => {return response.json()}
		).then(
			result => {
				dispatch({
					type: 'SET_REGISTER_TEACHER',
					payload: result
				});
			}
		);
};
