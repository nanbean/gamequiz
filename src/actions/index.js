export const setQuizId = params => ({
	type: 'SET_QUIZ_ID',
	payload: params
});

export const setQuestion = params => ({
	type: 'SET_QUESTION',
	payload: params
});

export const setPlayId = params => ({
	type: 'SET_PLAY_ID',
	payload: params
});

export const setStudentPlayerList = params => ({
	type: 'SET_STUDENT_PLAYER_LIST',
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
		response => (
			response.json()
		)
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
		response => (
			response.json()
		)
	).then(
		result => (
			dispatch({
				type: 'SET_REGISTER_TEACHER',
				payload: result
			})
		)
	)
);

export const callGetQuizList = params => dispatch => (
	fetchCall('/api/teacher/getQuizList', params).then(
		response => (
			response.json()
		)
	).then(
		result => (
			dispatch({
				type: 'SET_GET_QUIZ_LIST',
				payload: result
			})
		)
	)
);

export const callGetFeedBackList = params => dispatch => (
	fetchCall('/api/teacher/getFeedBackList', params).then(
		response => (
			response.json()
		)
	).then(
		result => (
			dispatch({
				type: 'SET_GET_FEEDBACK_LIST',
				payload: result
			})
		)
	)
);

export const callGetQuestionList = params => dispatch => (
	fetchCall('/api/teacher/getQuestionList', params).then(
		response => (
			response.json()
		)
	).then(
		result => (
			dispatch({
				type: 'SET_GET_QUESTION_LIST',
				payload: result
			})
		)
	)
);

export const callAddQuestion = params => () => (
	fetchCall('/api/teacher/addQuestion', params).then(
		response => (
			response.json()
		)
	).then()
);

export const callEditQuestion = params => () => (
	fetchCall('/api/teacher/editQuestion', params).then(
		response => (
			response.json()
		)
	).then()
);

export const callGetServerEventTeacher = params => (dispatch) => {
	const source = new EventSource(`/api/teacher/getServerEventTeacher?playId=${params.playId}`);

	source.addEventListener('message', function(e) {
		const data = JSON.parse(e.data);

		if (data.studentPlayerList) {
			dispatch({
				type: 'SET_STUDENT_PLAYER_LIST',
				payload: data
			});
		}
		if (data.serverStatus) {
			dispatch({
				type: 'SET_SERVER_STATUS',
				payload: data
			});
		}
		if (data.question) {
			dispatch({
				type: 'SET_PLAY_QUESTION',
				payload: data
			});
		}
		if (typeof data.timeOut !== 'undefined') {
			dispatch({
				type: 'SET_PLAY_TIME_OUT',
				payload: data
			});
		}
		if (typeof data.result !== 'undefined') {
			dispatch({
				type: 'SET_PLAY_RESULT',
				payload: data
			});
		}
		if (typeof data.leaderBoard !== 'undefined') {
			dispatch({
				type: 'SET_PLAY_LEADER_BOARD',
				payload: data
			});
		}
	}, false);

	source.addEventListener('open', function () {
	}, false);

	source.addEventListener('error', function () {
	}, false);
};

export const callStartGameMode = params => dispatch => (
	fetchCall('/api/teacher/startGameMode', params).then(
		response => (
			response.json()
		)
	).then(
		(result) => {
			dispatch({
				type: 'SET_PLAY_ID_N_GAMEMODE',
				payload: result
			});
			dispatch(callGetServerEventTeacher({
				playId: result.playId
			}));
		}
	)
);

export const callStartPlay = params => () => (
	fetchCall('/api/teacher/startPlay', params).then(
		response => (
			response.json()
		)
	).then()
);

export const callNextPlayQuestion = params => () => (
	fetchCall('/api/teacher/nextPlayQuestion', params).then(
		response => (
			response.json()
		)
	).then()
);

export const callCheckPlayId = params => dispatch => (
	fetchCall('/api/student/checkPlayId', params).then(
		response => (
			response.json()
		)
	).then(
		result => (
			dispatch({
				type: 'SET_CHECK_PLAY_ID',
				payload: result
			})
		)
	)
);

export const callGetServerEvent = params => (dispatch) => {
	const source = new EventSource(`/api/getServerEvent?playId=${params.playId}&studentId=${params.studentId}`);

	source.addEventListener('message', function (e) {
		if (e.data) {
			dispatch({
				type: 'SET_SERVER_STATUS',
				payload: JSON.parse(e.data)
			});
		}
	}, false);

	source.addEventListener('open', function () {
	}, false);

	source.addEventListener('error', function () {
	}, false);
};

export const callSendStudentInfo = params => dispatch => (
	fetchCall('/api/student/sendStudentInfo', params).then(
		response => (
			response.json()
		)
	).then(
		(result) => {
			dispatch({
				type: 'SET_SEND_STUDENT_INFO',
				payload: result
			});
			dispatch(callGetServerEvent({
				playId: result.playId,
				studentId: result.studentId
			}));
		}
	)
);

export const callSendStudentAnswer = params => dispatch => (
	fetchCall('/api/student/sendStudentAnswer', params).then(
		response => (
			response.json()
		)
	).then(
		result => (
			dispatch({
				type: 'SET_STUDENT_ANSWERED',
				payload: result
			})
		)
	)
);

