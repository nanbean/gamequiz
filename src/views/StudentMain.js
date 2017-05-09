import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Input, Loader, Grid, Button } from 'semantic-ui-react';

import { callCheckPlayId, setPlayId, callSendStudentInfo, callGetServerEvent, callSendStudentAnswer } from '../actions';

import '../styles/student.css';

class StudentMain extends Component {
	constructor (props) {
		super(props);

		this.onPlayIdEnter = this.onPlayIdEnter.bind(this);
		this.onNameInput = this.onNameInput.bind(this);
		this.onNickInput = this.onNickInput.bind(this);
		this.onNickKeyInput = this.onNickKeyInput.bind(this);
		this.onExample1Button = this.onExample1Button.bind(this);
		this.onExample2Button = this.onExample2Button.bind(this);
		this.onExample3Button = this.onExample3Button.bind(this);
		this.onExample4Button = this.onExample4Button.bind(this);

		this.state = {
			name: '',
			nick: ''
		};
	}

	onPlayIdEnter (ev) {
		if (ev.key === 'Enter') {
			this.props.callCheckPlayId({
				playId: ev.target.value
			});
			this.props.setPlayId({
				playId: ev.target.value
			});
		}
	}

	onNameInput (ev, data) {
		this.setState({
			name: data.value
		});
	}

	onNickInput (ev, data) {
		this.setState({
			nick: data.value
		});
	}

	onNickKeyInput (ev) {
		if (ev.key === 'Enter') {
			this.props.callSendStudentInfo({
				playId: this.props.playId,
				studentName: this.state.name,
				studentNick: this.state.nick
			});
		}
	}

	onExample1Button () {
		this.props.callSendStudentAnswer({
			playId: this.props.playId,
			studentId: this.props.studentId,
			answer: 1
		});
		this.setState({
			answered: true
		});
	}

	onExample2Button () {
		this.props.callSendStudentAnswer({
			playId: this.props.playId,
			studentId: this.props.studentId,
			answer: 2
		});
		this.setState({
			answered: true
		});
	}

	onExample3Button () {
		this.props.callSendStudentAnswer({
			playId: this.props.playId,
			studentId: this.props.studentId,
			answer: 3
		});
		this.setState({
			answered: true
		});
	}

	onExample4Button () {
		this.props.callSendStudentAnswer({
			playId: this.props.playId,
			studentId: this.props.studentId,
			answer: 4
		});
		this.setState({
			answered: true
		});
	}

	render () {
		const { studentPage, serverStatus, studentAnswered } = this.props;

		return (
			<div className='student'>
				{ studentPage === 'main' &&
					<div>
						<div className='student-logo' />
						<Input
							size='huge'
							icon='send'
							placeholder='Type your game ID'
							onKeyPress={this.onPlayIdEnter}
						/>
					</div>
				}
				{
					studentPage === 'login' &&
					<div>
						<div className='student-logo' />
						<Input
							size='huge'
							label='Name'
							placeholder='Type your real name'
							onChange={this.onNameInput}
							defaultValue={this.state.name}
						/>
						<Input
							size='huge'
							label='Nickame'
							placeholder='Type your nickname for the game'
							onKeyPress={this.onNickKeyInput}
							onChange={this.onNickInput}
							defaultValue={this.state.nick}
						/>
					</div>
				}

				{
					studentPage === 'play' && serverStatus === 'WAIT' &&
					<div>
						<Loader active>{serverStatus}</Loader>
					</div>
				}
				{
					studentPage === 'play' && serverStatus === 'RESULT' &&
					<div>
						<Loader active>{serverStatus}</Loader>
					</div>
				}
				{
					studentPage === 'play' && serverStatus === 'LEADER_BOARD' &&
					<div>
						<Loader active>{serverStatus}</Loader>
					</div>
				}
				{
					studentPage === 'play' && serverStatus === 'PLAY' && !studentAnswered &&
					<div>
						<Grid divided='vertically'>
							<Grid.Row columns={2}>
								<Grid.Column>
									<Button
										fluid
										size='huge'
										onClick={this.onExample1Button}
									>
										1
									</Button>
								</Grid.Column>
								<Grid.Column>
									<Button
										fluid
										size='huge'
										onClick={this.onExample2Button}
									>
										2
									</Button>
								</Grid.Column>
							</Grid.Row>
							<Grid.Row columns={2}>
								<Grid.Column>
									<Button
										fluid
										size='huge'
										onClick={this.onExample3Button}
									>
										3
									</Button>
								</Grid.Column>
								<Grid.Column>
									<Button
										fluid
										size='huge'
										onClick={this.onExample4Button}
									>
										4
									</Button>
								</Grid.Column>
							</Grid.Row>
						</Grid>
					</div>
				}
				{
					studentPage === 'play' && serverStatus === 'PLAY' && studentAnswered &&
					<div>
						<Loader active>{serverStatus}</Loader>
					</div>
				}
			</div>
		);
	}
}

StudentMain.propTypes = {
	playId: PropTypes.number.isRequired,
	studentId: PropTypes.number.isRequired,
	studentPage: PropTypes.string.isRequired,
	serverStatus: PropTypes.string.isRequired,
	studentAnswered: PropTypes.bool.isRequired,
	callCheckPlayId: PropTypes.func.isRequired,
	setPlayId: PropTypes.func.isRequired,
	callSendStudentAnswer: PropTypes.func.isRequired,
	callSendStudentInfo: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
	studentPage: state.studentPage,
	playId: state.playId,
	serverStatus: state.serverStatus,
	studentId: state.studentId,
	studentAnswered: state.studentAnswered
});

const mapDispatchToProps = dispatch => ({
	callCheckPlayId (param) {
		dispatch(callCheckPlayId(param));
	},
	setPlayId (param) {
		dispatch(setPlayId(param));
	},
	callSendStudentInfo (param) {
		dispatch(callSendStudentInfo(param));
	},
	callGetServerEvent (param) {
		dispatch(callGetServerEvent(param));
	},
	callSendStudentAnswer (param) {
		dispatch(callSendStudentAnswer(param));
	}
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(StudentMain));
