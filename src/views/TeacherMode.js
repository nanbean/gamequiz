import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Divider, Button, Popup, Header } from 'semantic-ui-react';

import TitleHeader from '../components/TitleHeader';

import { callStartGameMode } from '../actions';

import strings from '../resources/strings';
import '../styles/teacher.css';

class TeacherMode extends Component {
	constructor (props) {
		super(props);

		this.onQuizMarathonButton = this.onQuizMarathonButton.bind(this);
		this.onQuizSurvivalButton = this.onQuizSurvivalButton.bind(this);
		this.onQuizTeamButton = this.onQuizTeamButton.bind(this);
	}

	onQuizMarathonButton () {
		this.props.callStartGameMode({
			teacherId: this.props.teacherId,
			quizId: this.props.quizId,
			gameMode: 'MARATHON'
		});
		this.props.history.push('/wait/');
	}

	onQuizSurvivalButton () {
		this.props.callStartGameMode({
			quizId: this.props.quizId,
			gameMode: 'SURVIVAL'
		});
		this.props.history.push('/wait/');
	}

	onQuizTeamButton () {
		this.props.callStartGameMode({
			quizId: this.props.quizId,
			gameMode: 'TEAM'
		});
		this.props.history.push('/wait/');
	}

	render () {
		const { quizName } = this.props;

		return (
			<div className='teacher'>
				<div className='teacher-top'>
					<TitleHeader
						icon='law'
						title={strings.selectGameMode}
					/>
					<Divider />
				</div>
				<div className='teacher-floater' />
				<div className='teacher-content'>
					<Header
						size='huge'
					>
						{quizName}
					</Header>
					<div>
						<Popup
							trigger={
								<Button
									className='teacher-mode-button'
									content={strings.marathon}
									icon='graduation'
									size='massive'
									labelPosition='left'
									onClick={this.onQuizMarathonButton}
								/>
							}
							content={strings.marathonHelp}
							position='right center'
							hideOnScroll
						/>
					</div>
					<div>
						<Popup
							trigger={
								<Button
									className='teacher-mode-button'
									content={strings.survival}
									icon='child'
									size='massive'
									labelPosition='left'
									onClick={this.onQuizSurvivalButton}
								/>
							}
							content={strings.survivalHelp}
							position='right center'
							hideOnScroll
						/>
					</div>
					<div>
						<Popup
							trigger={
								<Button
									disabled
									className='teacher-mode-button'
									content={strings.team}
									icon='users'
									size='massive'
									labelPosition='left'
									onClick={this.onQuizTeamButton}
								/>
							}
							content={strings.teamHelp}
							position='right center'
							hideOnScroll
						/>
					</div>
				</div>
			</div>
		);
	}
}

TeacherMode.propTypes = {
	callStartGameMode: PropTypes.func.isRequired,
	history: PropTypes.object.isRequired,
	teacherId: PropTypes.string.isRequired,
	quizId: PropTypes.number.isRequired,
	quizName: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
	teacherId: state.teacherId,
	quizId: state.quizId,
	quizName: state.quizName
});

const mapDispatchToProps = dispatch => ({
	callStartGameMode (param) {
		dispatch(callStartGameMode(param));
	}
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TeacherMode));
