export const setQuizId = params => ({
	type: 'SET_QUIZ_ID',
	payload: params
});

export const setQuestion = params => ({
	type: 'SET_QUESTION',
	payload: params
});

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

export const checkTeacher = params => dispatch => (
	fetchCall('/api/teacher/checkTeacher', params).then(
		(response) => { response.json(); }
	).then(
		result => (
			dispatch({
				type: 'SET_CHECK_TEACHER',
				payload: result
			})
		)
	)
);

export const setTeacherInfo = params => (dispatch) => {
	if (params.userID) {
		dispatch(checkTeacher({ teacherId: params.userID }));
	}

	dispatch({
		type: 'SET_TEACHER_INFO',
		payload: params
	});
};

export const callRegisterTeacher = params => dispatch => (
	fetchCall('/api/teacher/registerTeacher', params).then(
		(response) => { response.json(); }
	).then(
		(result) => {
			dispatch({
				type: 'SET_REGISTER_TEACHER',
				payload: result
			});
		}
	)
);

export const callGetQuizList = params => dispatch => (
	fetchCall('/api/teacher/getQuizList', params).then(
		(response) => { response.json(); }
	).then(
		(result) => {
			dispatch({
				type: 'SET_GET_QUIZ_LIST',
				payload: result
			});
		}
	)
);

export const callGetFeedBackList = params => dispatch => (
	fetchCall('/api/teacher/getFeedBackList', params).then(
		(response) => { response.json(); }
	).then(
		(result) => {
			dispatch({
				type: 'SET_GET_FEEDBACK_LIST',
				payload: result
			});
		}
	)
);

export const callGetQuestionList = params => dispatch => (
	fetchCall('/api/teacher/getQuestionList', params).then(
		(response) => { response.json(); }
	).then(
		(result) => {
			dispatch({
				type: 'SET_GET_QUESTION_LIST',
				payload: result
			});
		}
	)
);

export const callAddQuestion = params => () => (
	fetchCall('/api/teacher/addQuestion', params).then(
		(response) => { response.json(); }
	).then()
);

export const callEditQuestion = params => () => (
	fetchCall('/api/teacher/editQuestion', params).then(
		(response) => { response.json(); }
	).then()
);

export const callStartGameMode = params => dispatch => (
	fetchCall('/api/teacher/startGameMode', params).then(
		(response) => { response.json(); }
	).then(
		(result) => {
			dispatch({
				type: 'SET_PLAY_ID_N_GAMEMODE',
				payload: result
			});
		}
	)
);
