import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import FacebookLogin from 'react-facebook-login';
import { Header } from 'semantic-ui-react';

import { setTeacherInfo } from '../actions';

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
					validTeacher === true && hasTeacherInfo && <Redirect to='/my' />
				}
				{
					validTeacher === false && hasTeacherInfo && <Redirect to='/join' />
				}
				<div className='teacher-outer'>
					<div className='teacher-inner'>
						<div className='teacher-logo' />
						<Header as='h1'>Welcome to GameQuiz</Header>
						<div>
							<FacebookLogin
								appId='1873315276258418'
								autoLoad
								fields='name,email,picture'
								callback={this.responseFacebook}
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
	teacherInfo: PropTypes.object.isRequired,
	setTeacherInfo: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
	teacherInfo: state.teacherInfo,
	checkTeacher: state.checkTeacher
});

const mapDispatchToProps = dispatch => ({
	setTeacherInfo (param) {
		dispatch(setTeacherInfo(param));
	}
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TeacherMain));
