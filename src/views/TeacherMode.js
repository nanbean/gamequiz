import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { Divider, Button } from 'semantic-ui-react';

import TitleHeader from '../components/TitleHeader';

import { callStartGameMode } from '../actions';

import '../styles/teacher.css';

class TeacherMode extends Component {
	constructor (props) {
		super(props);

		this.onQuizMarathonButton = this.onQuizMarathonButton.bind(this);
		this.onQuizSurvivalButton = this.onQuizSurvivalButton.bind(this);
		this.onQuizTeamButton = this.onQuizTeamButton.bind(this);
	}

	onQuizMarathonButton () {
		this.props.callStartGameMode({ gameMode: 'MARATHON' });
		this.props.history.push('/wait/');
	}

	onQuizSurvivalButton () {
		this.props.callStartGameMode({ gameMode: 'SURVIVAL' });
		this.props.history.push('/wait/');
	}

	onQuizTeamButton () {
		this.props.callStartGameMode({ gameMode: 'TEAM' });
		this.props.history.push('/wait/');
	}

	render () {
		const { teacherInfo } = this.props;

		return (
			<div className='teacher'>
				{
					!teacherInfo.userID && <Redirect to='/teacher' />
				}
				<TitleHeader
					icon='user'
					title='Select Game Mode'
				/>
				<Divider />
				<Button.Group widths='3'>
					<Button
						size='massive'
						onClick={this.onQuizMarathonButton}
					>
						Marathon
					</Button>
					<Button
						size='massive'
						onClick={this.onQuizSurvivalButton}
					>
						Survival
					</Button>
					<Button
						size='massive'
						onClick={this.onQuizTeamButton}
					>
						Team
					</Button>
				</Button.Group>
			</div>
		);
	}
}

TeacherMode.propTypes = {
	callStartGameMode: PropTypes.func.isRequired,
	history: PropTypes.object.isRequired,
	teacherInfo: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	teacherInfo: state.teacherInfo
});

const mapDispatchToProps = dispatch => ({
	callStartGameMode (param) {
		dispatch(callStartGameMode(param));
	}
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TeacherMode));
