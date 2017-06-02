import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Grid, Header, Button, Icon, Segment, Table, Image } from 'semantic-ui-react';

import { callNextPlayQuestion, resetToHome } from '../actions';

import strings from '../resources/strings';
import '../styles/teacher.css';
import triangle from '../assets/triangle.svg';
import diamond from '../assets/diamond.svg';
import circle from '../assets/circle.svg';
import square from '../assets/square.svg';
import gold from '../assets/gold.png';
import silver from '../assets/silver.png';
import bronze from '../assets/bronze.png';
import newRanker from '../assets/newRanker.gif';
import rocket from '../assets/rocket.gif';

const exampleMap = [
	<Image src={triangle} size='mini' spaced />,
	<Image src={diamond} size='mini' spaced />,
	<Image src={circle} size='mini' spaced />,
	<Image src={square} size='mini' spaced />
];

class TeacherPlay extends Component {
	constructor (props) {
		super(props);

		this.onNextQuestionButton = this.onNextQuestionButton.bind(this);
		this.onHomeEnter = this.onHomeEnter.bind(this);
		this.waitTimer = this.waitTimer.bind(this);

		this.state = {
			waitTimerId: null,
			waitCount: 0
		};
	}

	componentDidMount () {
		const { serverStatus } = this.props;
		const { waitTimerId } = this.state;

		if (serverStatus === 'WAIT' && !waitTimerId) {
			this.state = {
				waitTimerId: setInterval(this.waitTimer, 1000),
				waitCount: 2
			};
		} else {
			this.state = {
				waitTimerId: null,
				waitCount: 0
			};
		}
	}

	componentWillReceiveProps (nextProps) {
		const { serverStatus } = nextProps;
		const { waitTimerId } = this.state;

		if (serverStatus === 'WAIT' && !waitTimerId) {
			this.setState({
				waitTimerId: setInterval(this.waitTimer, 1000),
				waitCount: 2
			});
		}
	}

	componentWillUnmount () {
		clearInterval(this.state.waitTimerId);
		this.setState({
			waitTimerId: null
		});
	}

	onNextQuestionButton () {
		this.props.callNextPlayQuestion({
			playId: this.props.playId
		});
	}

	onHomeEnter () {
		this.props.history.push('/my');
		this.props.resetToHome();
	}

	waitTimer () {
		const newWaitCount = this.state.waitCount - 1;
		if (newWaitCount >= 0) {
			this.setState({
				waitCount: newWaitCount
			});
		} else {
			clearInterval(this.state.waitTimerId);
			this.setState({
				waitTimerId: null
			});
		}
	}

	renderLeaderBoard (data, index) {
		this.studentId = data.studentId;
		this.studentNick = data.studentNick;
		this.score = data.score;
		this.newRanker = data.newRanker;
		this.rocket = data.rocket;

		return (
			<Table.Row key={this.studentId}>
				<Table.Cell>
					<Header as='h2' textAlign='center'>
						{
							index === 0 &&
							<Image src={gold} size='mini' spaced />
						}
						{
							index === 1 &&
							<Image src={silver} size='mini' spaced />
						}
						{
							index === 2 &&
							<Image src={bronze} size='mini' spaced />
						}
						{index + 1}
					</Header>
				</Table.Cell>
				<Table.Cell>
					<Header as='h2' textAlign='center'>
						{this.studentNick}
						{
							this.newRanker === true &&
							<Image src={newRanker} size='mini' spaced />
						}
						{
							this.rocket === true &&
							<Image src={rocket} size='mini' spaced />
						}
					</Header>
				</Table.Cell>
				<Table.Cell>
					<Header as='h2' textAlign='center'>{this.score}</Header>
				</Table.Cell>
			</Table.Row>
		);
	}

	renderSurvivors (data) {
		this.studentNick = data.studentNick;

		return (
			<Table.Row key={this.studentId}>
				<Table.Cell>
					<Header as='h2' textAlign='center'>{this.studentNick}</Header>
				</Table.Cell>
			</Table.Row>
		);
	}

	render () {
		const { serverStatus, playQuestion, playTimeOut, playResult, playLeaderBoard } = this.props;
		const { gameMode, playSurvivors } = this.props;
		const { waitCount } = this.state;

		return (
			<div className='teacher'>
				<div className='teacher-outer'>
					<div className='teacher-inner'>
						{ serverStatus === 'WAIT' &&
							<div>
								<div>
									<div>
										<Icon.Group size='huge'>
											<Icon loading name='hourglass empty' />
											<Icon size='big' name='sun' />
										</Icon.Group>
									</div>
									<div style={{ margin: 20 }}>
										<Header as='h2' icon>
											{strings.readyToGo}
											<Header.Subheader>
												{strings.getBusy}
											</Header.Subheader>
										</Header>
									</div>
								</div>
								{
									<div className='teacher-play-timer'>
										<Segment circular style={{ width: 100, height: 100 }}>
											<Header as='h1' color='purple'>
												{waitCount}
											</Header>
										</Segment>
									</div>
								}
							</div>
						}
						{ serverStatus === 'PLAY' &&
							<div>
								<div className='teacher-play-title'>
									<Segment>
										<Header
											as='h1'
											textAlign='center'
											content={playQuestion.title}
										/>
									</Segment>
									{
										playQuestion.pictureUrl &&
										<Image
											centered
											src={`/${playQuestion.pictureUrl}`}
											height={500}
										/>
									}
								</div>
								<div className='teacher-play-timer'>
									<Segment circular style={{ width: 100, height: 100 }}>
										<Header as='h1' color='brown'>
											{playTimeOut}
										</Header>
									</Segment>
								</div>
								<div className='teacher-play-example'>
									<Grid celled>
										<Grid.Row columns={2} padded>
											<Grid.Column>
												<Header
													as='h1'
													image={triangle}
													content={playQuestion.example1}
												/>
											</Grid.Column>
											<Grid.Column>
												<Header
													as='h1'
													image={diamond}
													content={playQuestion.example2}
												/>
											</Grid.Column>
										</Grid.Row>
										<Grid.Row columns={2} padded>
											<Grid.Column>
												<Header
													as='h1'
													image={circle}
													content={playQuestion.example3}
												/>
											</Grid.Column>
											<Grid.Column>
												<Header
													as='h1'
													image={square}
													content={playQuestion.example4}
												/>
											</Grid.Column>
										</Grid.Row>
									</Grid>
								</div>
							</div>
						}
						{ serverStatus === 'RESULT' &&
							<div>
								<Header as='h2' icon>
									<Icon name='idea' />
									{strings.result}
									<Header.Subheader>
										{strings.answerIs} {exampleMap[playResult.answer - 1]}
									</Header.Subheader>
								</Header>
								<Segment.Group piled>
									<Segment>
										<Header as='h2' icon>
											{playResult.example1} {strings.choseTheExample} {exampleMap[0]}
										</Header>
									</Segment>
									<Segment>
										<Header as='h2' icon>
											{playResult.example2} {strings.choseTheExample} {exampleMap[1]}
										</Header>
									</Segment>
									<Segment>
										<Header as='h2' icon>
											{playResult.example3} {strings.choseTheExample} {exampleMap[2]}
										</Header>
									</Segment>
									<Segment>
										<Header as='h2' icon>
											{playResult.example4} {strings.choseTheExample} {exampleMap[3]}
										</Header>
									</Segment>
								</Segment.Group>
							</div>
						}
						{ gameMode === 'MARATHON' && serverStatus === 'LEADER_BOARD' &&
							<div>
								<Header as='h2' icon>
									<Icon name='trophy' />
									{strings.leaderBoard}
									<Header.Subheader>
										{strings.scoreis}
									</Header.Subheader>
								</Header>
								<Table celled selectable>
									<Table.Header>
										<Table.Row>
											<Table.HeaderCell>
												<Header as='h3' textAlign='center'>{strings.ranking}</Header>
											</Table.HeaderCell>
											<Table.HeaderCell>
												<Header as='h3' textAlign='center'>{strings.nickName}</Header>
											</Table.HeaderCell>
											<Table.HeaderCell>
												<Header as='h3' textAlign='center'>{strings.score}</Header>
											</Table.HeaderCell>
										</Table.Row>
									</Table.Header>

									<Table.Body>
										{
											playLeaderBoard && playLeaderBoard.map(this.renderLeaderBoard, this)
										}
									</Table.Body>
								</Table>
								<Button
									fluid
									size='huge'
									onClick={this.onNextQuestionButton}
								>
									{strings.nextQuestion}
								</Button>
							</div>
						}
						{ gameMode === 'MARATHON' && serverStatus === 'END' &&
							<div>
								<Header as='h2' icon>
									<Icon name='trophy' />
									{strings.endOfPlay}
									<Header.Subheader>
										{strings.goodJob}
									</Header.Subheader>
								</Header>
								<Table celled selectable>
									<Table.Header>
										<Table.Row>
											<Table.HeaderCell>
												<Header as='h3' textAlign='center'>{strings.ranking}</Header>
											</Table.HeaderCell>
											<Table.HeaderCell>
												<Header as='h3' textAlign='center'>{strings.nickName}</Header>
											</Table.HeaderCell>
											<Table.HeaderCell>
												<Header as='h3' textAlign='center'>{strings.score}</Header>
											</Table.HeaderCell>
										</Table.Row>
									</Table.Header>

									<Table.Body>
										{
											playLeaderBoard && playLeaderBoard.map(this.renderLeaderBoard, this)
										}
									</Table.Body>
								</Table>
								<div>
									<Button
										className='teacher-home-button'
										size='huge'
										onClick={this.onHomeEnter}
									>
										{strings.home}
									</Button>
								</div>
							</div>
						}
						{ gameMode === 'SURVIVAL' && serverStatus === 'LEADER_BOARD' &&
							<div>
								<Header as='h2' icon>
									<Icon name='trophy' />
									{strings.survivors}
									<Header.Subheader>
										{strings.whoSurvived}
									</Header.Subheader>
								</Header>
								<Table celled selectable>
									<Table.Header>
										<Table.Row>
											<Table.HeaderCell>
												<Header as='h3' textAlign='center'>{strings.survivors}</Header>
											</Table.HeaderCell>
										</Table.Row>
									</Table.Header>

									<Table.Body>
										{
											playSurvivors && playSurvivors.map(this.renderSurvivors, this)
										}
									</Table.Body>
								</Table>
								<Button
									fluid
									size='huge'
									onClick={this.onNextQuestionButton}
								>
									{strings.nextQuestion}
								</Button>
							</div>
						}
						{ gameMode === 'SURVIVAL' && serverStatus === 'END' &&
							<div>
								<Header as='h2' icon>
									<Icon name='trophy' />
									{strings.endOfPlay}
									<Header.Subheader>
										{strings.goodJob}
									</Header.Subheader>
								</Header>
								<Table celled selectable>
									<Table.Header>
										<Table.Row>
											<Table.HeaderCell>
												<Header as='h3' textAlign='center'>{strings.survivors}</Header>
											</Table.HeaderCell>
										</Table.Row>
									</Table.Header>

									<Table.Body>
										{
											playSurvivors && playSurvivors.map(this.renderSurvivors, this)
										}
									</Table.Body>
								</Table>
								<div>
									<Button
										className='teacher-home-button'
										size='huge'
										onClick={this.onHomeEnter}
									>
										{strings.home}
									</Button>
								</div>
							</div>
						}
					</div>
				</div>
			</div>
		);
	}
}

TeacherPlay.propTypes = {
	history: PropTypes.object.isRequired,
	playId: PropTypes.string.isRequired,
	playQuestion: PropTypes.object.isRequired,
	playTimeOut: PropTypes.number.isRequired,
	playResult: PropTypes.object.isRequired,
	serverStatus: PropTypes.string.isRequired,
	playLeaderBoard: PropTypes.array.isRequired,
	gameMode: PropTypes.string.isRequired,
	playSurvivors: PropTypes.arrayOf(PropTypes.object).isRequired,
	resetToHome: PropTypes.func.isRequired,
	callNextPlayQuestion: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
	serverStatus: state.serverStatus,
	playQuestion: state.playQuestion,
	playTimeOut: state.playTimeOut,
	playId: state.playId,
	playResult: state.playResult,
	playLeaderBoard: state.playLeaderBoard,
	gameMode: state.gameMode,
	playSurvivors: state.playSurvivors
});

const mapDispatchToProps = dispatch => ({
	callNextPlayQuestion (param) {
		dispatch(callNextPlayQuestion(param));
	},
	resetToHome () {
		dispatch(resetToHome());
	}
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TeacherPlay));
