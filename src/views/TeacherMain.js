import React, { Component } from 'react';
import { withRouter, Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import FacebookLogin from 'react-facebook-login';

import { setTeacherInfo } from '../actions';

import quiz from '../quiz.png';
import '../styles/teacher.css';

class TeacherMain extends Component {
	constructor (props) {
		super(props);

		this.responseFacebook = this.responseFacebook.bind(this);
	}

	responseFacebook (ev) {
		this.props.setTeacherInfo(ev);
	}

	render () {
		const { teacherInfo, checkTeacher } = this.props;
		const validTeacher = checkTeacher && checkTeacher.valid;
		const hasTeacherInfo = teacherInfo && teacherInfo.userID;

		return (
			
			<div className='teacher'>
				{
					validTeacher === true && hasTeacherInfo && <Redirect to='/my'/>
				}
				{
					validTeacher === false && hasTeacherInfo && <Redirect to='/join'/>
				}
				<img
					src={quiz}
					className='teacher-logo'
					alt='quiz'
				/>
				<h2>
					Welcome to GameQuiz
				</h2>
				<div>
					<FacebookLogin
						appId='1873315276258418'
						autoLoad={true}
						fields='name,email,picture'
						callback={this.responseFacebook}
					/>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	teacherInfo: state.teacherInfo,
	checkTeacher: state.checkTeacher
});

const mapDispatchToProps = (dispatch) => ({
	setTeacherInfo (param) {
		dispatch(setTeacherInfo(param));
	}
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TeacherMain))
