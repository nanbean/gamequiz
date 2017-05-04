import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { Header, Divider, List, Button, Loader } from 'semantic-ui-react';

import TitleHeader from '../components/TitleHeader';

import '../styles/teacher.css';

class TeacherWait extends Component {
	constructor (props) {
		super(props);

		this.onQuizStartButton = this.onQuizStartButton.bind(this);
	}

	onQuizStartButton () {

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

	render () {
		const { teacherInfo, playId, gameMode } = this.props;

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
	teacherInfo: PropTypes.object.isRequired,
	playId: PropTypes.object.isRequired,
	gameMode: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	teacherInfo: state.teacherInfo,
	playId: state.playId,
	gameMode: state.gameMode
});

export default withRouter(connect(mapStateToProps, null)(TeacherWait));
