import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';
import { Header, Icon } from 'semantic-ui-react';

import { setTeacherInfo } from '../actions';

import strings from '../resources/strings';
import '../styles/teacher.css';

class TeacherMain extends Component {
	constructor (props) {
		super(props);

		this.responseFacebook = this.responseFacebook.bind(this);
		this.responseGoogle = this.responseGoogle.bind(this);
	}

	responseFacebook (ev) {
		if (typeof ev.userID !== 'undefined') {
			const teacherInfo = ev;
			teacherInfo.teacherLoginType = 'facebook';
			this.props.setTeacherInfo(teacherInfo);
		}
	}

	responseGoogle (ev) {
		if (typeof ev.googleId !== 'undefined') {
			const teacherInfo = ev;
			teacherInfo.teacherLoginType = 'google';
			this.props.setTeacherInfo(teacherInfo);
		}
	}

	render () {
		const { teacherId, checkTeacher } = this.props;
		const validTeacher = checkTeacher && checkTeacher.valid;

		return (

			<div className='teacher'>
				{
					validTeacher === true && teacherId && <Redirect to='/my' />
				}
				{
					validTeacher === false && teacherId && <Redirect to='/join' />
				}
				<div className='teacher-outer'>
					<div className='teacher-inner'>
						<div className='teacher-logo' />
						<Header as='h1'>{strings.welcome}</Header>
						<div className='teacher-button'>
							<Icon bordered name='facebook' size='large' />
							<FacebookLogin
								cssClass='ui button teacher-login-button'
								appId='1873315276258418'
								fields='name,email,picture'
								textButton={strings.facebookLogin}
								callback={this.responseFacebook}
							/>
						</div>
						<div className='teacher-button'>
							<Icon bordered name='google' size='large' />
							<GoogleLogin
								className='ui button teacher-login-button'
								clientId='703855235482-2e3n67urm1ongdi9bmrjadjlqdqpidlc.apps.googleusercontent.com'
								buttonText={strings.googleLogin}
								onSuccess={this.responseGoogle}
								onFailure={this.responseGoogle}
							/>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

TeacherMain.propTypes = {
	checkTeacher: PropTypes.object.isRequired,
	teacherId: PropTypes.string.isRequired,
	setTeacherInfo: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
	teacherId: state.teacherId,
	checkTeacher: state.checkTeacher
});

const mapDispatchToProps = dispatch => ({
	setTeacherInfo (param) {
		dispatch(setTeacherInfo(param));
	}
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TeacherMain));
