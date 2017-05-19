import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Input, Loader, Grid, Button, Header, Icon } from 'semantic-ui-react';

import { callCheckPlayId, setPlayId, callSendStudentInfo, callGetServerEvent, callSendStudentAnswer, resetToHome } from '../actions';

import '../styles/student.css';
import triangle from '../assets/triangle.svg';
import diamond from '../assets/diamond.svg';
import circle from '../assets/circle.svg';
import square from '../assets/square.svg';

class StudentMain extends Component {
	constructor (props) {
		super(props);

		this.onPlayIdEnter = this.onPlayIdEnter.bind(this);
		this.onPlayIdInput = this.onPlayIdInput.bind(this);
		this.onPlayEnter = this.onPlayEnter.bind(this);
		this.onNameInput = this.onNameInput.bind(this);
		this.onNickInput = this.onNickInput.bind(this);
		this.onNickKeyInput = this.onNickKeyInput.bind(this);
		this.onLoginEnter = this.onLoginEnter.bind(this);
		this.onExample1Button = this.onExample1Button.bind(this);
		this.onExample2Button = this.onExample2Button.bind(this);
		this.onExample3Button = this.onExample3Button.bind(this);
		this.onExample4Button = this.onExample4Button.bind(this);
		this.onHomeEnter = this.onHomeEnter.bind(this);

		this.state = {
			playId: '',
			name: '',
			nick: ''
		};
	}

	onPlayIdEnter (ev) {
		if (ev.key === 'Enter') {
			this.onPlayEnter();
		}
	}

	onPlayEnter () {
		this.props.callCheckPlayId({
			playId: this.state.playId
		});
		this.props.setPlayId({
			playId: this.state.playId
		});
	}

	onPlayIdInput (ev, data) {
		this.setState({
			playId: data.value
		});
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
			this.onLoginEnter();
		}
	}

	onLoginEnter () {
		this.props.callSendStudentInfo({
			playId: this.props.playId,
			studentName: this.state.name,
			studentNick: this.state.nick
		});
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

	onHomeEnter () {
		this.props.resetToHome();
	}

	render () {
		const { studentPage, serverStatus, studentAnswered } = this.props;

		return (
			<div className='student'>
				{ studentPage === 'main' &&
					<div className='student-outer'>
						<div className='student-inner'>
							<div className='student-logo' />
							<div>
								<Input
									className='student-palyid-input'
									size='huge'
									icon='send'
									placeholder='Type your game ID'
									onKeyPress={this.onPlayIdEnter}
									onChange={this.onPlayIdInput}
								/>
							</div>
							<div>
								<Button
									className='student-palyid-button'
									size='huge'
									onClick={this.onPlayEnter}
								>
									Play
								</Button>
							</div>
						</div>
					</div>
				}
				{
					studentPage === 'login' &&
					<div className='student-outer'>
						<div className='student-inner'>
							<div className='student-logo' />
							<div>
								<Input
									className='student-name-input'
									size='huge'
									placeholder='Type your real name'
									onChange={this.onNameInput}
									defaultValue={this.state.name}
								/>
							</div>
							<div>
								<Input
									className='student-nick-input'
									size='huge'
									placeholder='Type your nickname for the game'
									onKeyPress={this.onNickKeyInput}
									onChange={this.onNickInput}
									defaultValue={this.state.nick}
								/>
							</div>
							<div>
								<Button
									className='student-login-button'
									size='huge'
									onClick={this.onLoginEnter}
								>
									Go
								</Button>
							</div>
						</div>
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
					studentPage === 'play' && serverStatus === 'END' &&
					<div className='student-outer'>
						<div className='student-inner'>
							<Header as='h2' icon textAlign='center'>
								<Icon name='info' circular />
								<Header.Content>
									Game Over
								</Header.Content>
							</Header>
							<div>
								<Button
									className='student-home-button'
									size='huge'
									onClick={this.onHomeEnter}
								>
									Home
								</Button>
							</div>
						</div>
					</div>
				}
				{
					studentPage === 'play' && serverStatus === 'PLAY' && !studentAnswered &&
					<div className='student-outer'>
						<div className='student-inner'>
							<Grid celled className='student-example'>
								<Grid.Row columns={2} padded>
									<Grid.Column>
										<Header
											as='h1'
											image={triangle}
											onClick={this.onExample1Button}
										/>
									</Grid.Column>
									<Grid.Column>
										<Header
											as='h1'
											image={diamond}
											onClick={this.onExample2Button}
										/>
									</Grid.Column>
								</Grid.Row>
								<Grid.Row columns={2} padded>
									<Grid.Column>
										<Header
											as='h1'
											image={circle}
											onClick={this.onExample3Button}
										/>
									</Grid.Column>
									<Grid.Column>
										<Header
											as='h1'
											image={square}
											onClick={this.onExample4Button}
										/>
									</Grid.Column>
								</Grid.Row>
							</Grid>
						</div>
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
	resetToHome: PropTypes.func.isRequired,
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
	resetToHome () {
		dispatch(resetToHome());
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
