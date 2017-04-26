import React, { Component } from 'react';
import { withRouter, Redirect } from 'react-router-dom'
import { connect } from 'react-redux';

import Quiz from '../components/quiz';

import '../styles/teacher.css';

class TeacherMy extends Component {
	render () {
		const { teacherInfo } = this.props;

		return (
			<div className='teacher'>
				{
					!teacherInfo.userID && <Redirect to='/teacher'/>
				}
				<h2>
					Welcome {teacherInfo.name}
				</h2>
				{
					teacherInfo.picture &&
					<img
						src={teacherInfo.picture.data.url}
						alt='avatar'
					/>
				}
				<div>
					<h2>
						Quiz List
					</h2>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	teacherInfo: state.teacherInfo
});

export default withRouter(connect(mapStateToProps, null)(TeacherMy))
