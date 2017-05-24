import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button, Header, Divider } from 'semantic-ui-react';

import Avatar from '../components/Avatar';
import TitleHeader from '../components/TitleHeader';

import { callRegisterTeacher } from '../actions';

import strings from '../resources/strings';
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
		const { teacherName, teacherImage, teacherId, registerTeacher } = this.props;
		const isRegistered = registerTeacher.return;

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
					title={strings.joinGameQuiz}
				/>
				<Divider />
				<Header as='h1'>
					{strings.wannaJoin}
				</Header>
				{
					teacherName && teacherImage &&
					<Avatar
						url={teacherImage}
						name={teacherName}
					/>
				}
				<Divider />
				<div>
					<Button
						size='huge'
						onClick={this.onJoinButton}
					>
						{strings.confirm}
					</Button>
				</div>
			</div>
		);
	}
}

TeacherJoin.propTypes = {
	callRegisterTeacher: PropTypes.func.isRequired,
	registerTeacher: PropTypes.object.isRequired,
	teacherId: PropTypes.string.isRequired,
	teacherName: PropTypes.string.isRequired,
	teacherImage: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
	teacherId: state.teacherId,
	teacherName: state.teacherName,
	teacherImage: state.teacherImage,
	registerTeacher: state.registerTeacher
});

const mapDispatchToProps = dispatch => ({
	callRegisterTeacher (param) {
		dispatch(callRegisterTeacher(param));
	}
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TeacherJoin));
