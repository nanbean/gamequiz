import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { Header, Divider, List, Button, Loader } from 'semantic-ui-react';

import TitleHeader from '../components/TitleHeader';

import { setStudentPlayerList, callStartPlay } from '../actions';

import '../styles/teacher.css';

class TeacherWait extends Component {
	constructor (props) {
		super(props);

		this.onQuizStartButton = this.onQuizStartButton.bind(this);
	}

	onQuizStartButton () {
		this.props.callStartPlay({
			playId: this.props.playId
		});
		this.props.history.push('/play/');
	}

	renderQuiz (data) {
		return (
			<List.Item key={data.quizId}>
				<List.Content floated='right'>
					<Button content='Start' icon='play' labelPosition='left' />
					<Button
						content='Edit'
						icon='edit'
						labelPosition='left'
						onClick={this.onQuizEditButton}
						target={data.quizId}
					/>
				</List.Content>
				<List.Content floated='left'>
					<Header as='h2'>
						{data.quizTitle}
					</Header>
				</List.Content>
			</List.Item>
		);
	}

	renderStudentPlayer (data) {
		return (
			<Header as='h2' key={data.studentId}>
				{data.studentNick}
			</Header>
		);
	}

	render () {
		const { teacherInfo, playId, gameMode, studentPlayerList } = this.props;

		return (
			<div className='teacher'>
				{
					!teacherInfo.userID && <Redirect to='/teacher' />
				}
				<TitleHeader
					icon='wait'
					title='Wait your game'
				/>
				<Divider />
				<Header as='h2'>
					Your Play ID is {playId}
				</Header>
				<Header as='h2'>
					Your Game Mode is {gameMode}
				</Header>
				{
					studentPlayerList && studentPlayerList.map(this.renderStudentPlayer, this)
				}
				<Loader active>Wait</Loader>
				<Button
					fluid
					size='huge'
					onClick={this.onQuizStartButton}
				>
					Start
				</Button>
			</div>
		);
	}
}

TeacherWait.propTypes = {
	history: PropTypes.object.isRequired,
	teacherInfo: PropTypes.object.isRequired,
	playId: PropTypes.number.isRequired,
	gameMode: PropTypes.object.isRequired,
	studentPlayerList: PropTypes.array.isRequired,
	callStartPlay: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
	teacherInfo: state.teacherInfo,
	playId: state.playId,
	gameMode: state.gameMode,
	studentPlayerList: state.studentPlayerList
});

const mapDispatchToProps = dispatch => ({
	setStudentPlayerList (param) {
		dispatch(setStudentPlayerList(param));
	},
	callStartPlay (param) {
		dispatch(callStartPlay(param));
	}
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TeacherWait));
