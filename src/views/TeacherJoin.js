import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button, Header, Divider } from 'semantic-ui-react';

import Avatar from '../components/Avatar';
import TitleHeader from '../components/TitleHeader';

import { callRegisterTeacher } from '../actions';

import '../styles/teacher.css';

class TeacherJoin extends Component {
	constructor (props) {
		super(props);

		this.onJoinButton = this.onJoinButton.bind(this);
	}

	onJoinButton () {
		this.props.callRegisterTeacher({
			teacherId: this.props.teacherId
		});
	}

	render () {
		const { teacherInfo, teacherId, registerTeacher } = this.props;
		const isRegistered = registerTeacher.return;
		const avatarUrl = teacherInfo && teacherInfo.picture && teacherInfo.picture.data.url;

		return (
			<div className='teacher'>
				{
					!teacherId && <Redirect to='/teacher' />
				}
				{
					isRegistered && <Redirect to='/my' />
				}
				<TitleHeader
					icon='add user'
					title='Join to GameQuiz'
				/>
				<Divider />
				<Header as='h1'>
					Do you want to join?
				</Header>
				{
					avatarUrl &&
					<Avatar
						url={teacherInfo.picture.data.url}
						name={teacherInfo.name}
					/>
				}
				<Divider />
				<div>
					<Button
						size='huge'
						onClick={this.onJoinButton}
					>
						Confirm
					</Button>
				</div>
			</div>
		);
	}
}

TeacherJoin.propTypes = {
	callRegisterTeacher: PropTypes.func.isRequired,
	registerTeacher: PropTypes.object.isRequired,
	teacherInfo: PropTypes.object.isRequired,
	teacherId: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
	teacherInfo: state.teacherInfo,
	teacherId: state.teacherId,
	registerTeacher: state.registerTeacher
});

const mapDispatchToProps = dispatch => ({
	callRegisterTeacher (param) {
		dispatch(callRegisterTeacher(param));
	}
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TeacherJoin));
