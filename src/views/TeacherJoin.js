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
			teacherId: this.props.teacherInfo.userID
		});
	}

	render () {
		const { teacherInfo, registerTeacher } = this.props;
		const isRegistered = registerTeacher.return;
		const avatarUrl = teacherInfo && teacherInfo.picture && teacherInfo.picture.data.url;

		return (
			<div className='teacher'>
				{
					!teacherInfo.userID && <Redirect to='/teacher' />
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
	teacherInfo: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	teacherInfo: state.teacherInfo,
	registerTeacher: state.registerTeacher
});

const mapDispatchToProps = dispatch => ({
	callRegisterTeacher (param) {
		dispatch(callRegisterTeacher(param));
	}
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TeacherJoin));
