import React, { Component } from 'react';
import { withRouter, Redirect } from 'react-router-dom'
import { connect } from 'react-redux';

import { callRegisterTeacher } from '../actions';

import '../styles/teacher.css';

class TeacherJoin extends Component {
	constructor (props) {
		super(props);

		this.onJoinButton = this.onJoinButton.bind(this);
	}

	onJoinButton () {
		this.props.callRegisterTeacher({
			facebookUserID: this.props.teacherInfo.userID
		});
	}

	render () {
		const {teacherInfo, registerTeacher} = this.props;
		const isRegistered = registerTeacher.return;

		return (
			<div className='teacher'>
				{
					!teacherInfo.userID && <Redirect to='/teacher'/>
				}
				{
					isRegistered && <Redirect to='/my'/>
				}
				<h2>
					Do you want to join {teacherInfo.name}?
				</h2>
				{
					teacherInfo.picture &&
					<img
						src={teacherInfo.picture.data.url}
						alt='avatar'
					/>
				}
				<div>
					<button
						onClick={this.onJoinButton}
					>
						Confirm
					</button>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	teacherInfo: state.teacherInfo,
	registerTeacher: state.registerTeacher
});

const mapDispatchToProps = (dispatch) => ({
	callRegisterTeacher (param) {
		dispatch(callRegisterTeacher(param));
	}
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TeacherJoin))
