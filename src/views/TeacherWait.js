import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { Header, Divider, Button, Label, Segment, Icon } from 'semantic-ui-react';

import TitleHeader from '../components/TitleHeader';

import { setStudentPlayerList, callStartPlay } from '../actions';

import strings from '../resources/strings';
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

	getGameModeName (gameMode) {
		this.gameMode = gameMode;

		if (this.gameMode === 'MARATHON') {
			return strings.marathon;
		} else if (this.gameMode === 'SURVIVAL') {
			return strings.survival;
		}

		return strings.team;
	}

	renderStudentPlayer (data) {
		this.studentId = data.studentId;
		this.studentNick = data.studentNick;

		return (
			<div className='teacher-wait-student'>
				<Header key={this.studentId} as='h3'>
					<Icon name='detective' />
					<Header.Content>
						{this.studentNick}
					</Header.Content>
				</Header>
			</div>
		);
	}

	render () {
		const { teacherId, playId, gameMode, studentPlayerList } = this.props;
		let icon = '';

		if (gameMode === 'MARATHON') {
			icon = 'graduation';
		} else if (gameMode === 'SURVIVAL') {
			icon = 'child';
		} else {
			icon = 'users';
		}

		return (
			<div className='teacher-normal'>
				{
					!teacherId && <Redirect to='/teacher' />
				}
				<TitleHeader
					icon='wait'
					title={strings.waitGame}
				/>
				<Divider />
				<Segment padded>
					<Label attached='top'>{strings.joinWith}</Label>
					<Header size='huge'>
						{playId}
					</Header>
				</Segment>
				<Button
					fluid
					size='huge'
					content={strings.start}
					icon='play'
					labelPosition='left'
					onClick={this.onQuizStartButton}
					disabled={studentPlayerList.length === 0}
				/>
				<Header as='h2' icon textAlign='center'>
					<Icon name={icon} />
					<Header.Content>
						{this.getGameModeName(gameMode)} {strings.mode}
					</Header.Content>
				</Header>
				<Divider />
				<div className='teacher-wait-student-list'>
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
	teacherId: PropTypes.string.isRequired,
	playId: PropTypes.string.isRequired,
	gameMode: PropTypes.object.isRequired,
	studentPlayerList: PropTypes.array.isRequired,
	callStartPlay: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
	teacherId: state.teacherId,
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
