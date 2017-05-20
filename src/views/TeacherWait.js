import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { Header, Divider, List, Button, Label, Segment, Icon } from 'semantic-ui-react';

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
		this.studentId = data.studentId;
		this.studentNick = data.studentNick;

		return (
			<Header key={this.studentId} as='h3'>
				<Icon name='detective' />
				<Header.Content>
					{this.studentNick}
				</Header.Content>
			</Header>
		);
	}

	render () {
		const { teacherInfo, playId, gameMode, studentPlayerList } = this.props;
		let icon = '';

		if (gameMode === 'MARATHON') {
			icon = 'graduation';
		} else if (gameMode === 'SURVIVAL') {
			icon = 'child';
		} else {
			icon = 'users';
		}

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
				<Segment padded>
					<Label attached='top'>Join with</Label>
					<Header size='huge'>
						{playId}
					</Header>
				</Segment>
				<Button
					fluid
					size='huge'
					content='Start'
					icon='play'
					labelPosition='left'
					onClick={this.onQuizStartButton}
					disabled={studentPlayerList.length === 0}
				/>
				<Header as='h2' icon textAlign='center'>
					<Icon name={icon} />
					<Header.Content>
						{gameMode} Mode
					</Header.Content>
				</Header>
				<Divider />
				<div>
					{
						studentPlayerList && studentPlayerList.map(this.renderStudentPlayer, this)
					}
				</div>
			</div>
		);
	}
}

TeacherWait.propTypes = {
	history: PropTypes.object.isRequired,
	teacherInfo: PropTypes.object.isRequired,
	playId: PropTypes.string.isRequired,
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
