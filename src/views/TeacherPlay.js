import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Grid, Header, Button, Icon, Segment, Table, Image } from 'semantic-ui-react';

import { callNextPlayQuestion } from '../actions';

import '../styles/teacher.css';
import triangle from '../assets/triangle.svg';
import diamond from '../assets/diamond.svg';
import circle from '../assets/circle.svg';
import square from '../assets/square.svg';

class TeacherPlay extends Component {
	constructor (props) {
		super(props);

		this.onNextQuestionButton = this.onNextQuestionButton.bind(this);
		this.waitTimer = this.waitTimer.bind(this);
	}

	componentDidMount () {
		const { serverStatus } = this.props;
		const { waitTimerId } = this.state;

		if (serverStatus === 'WAIT' && !waitTimerId) {
			this.state({
				waitTimerId: setInterval(this.waitTimer, 1000),
				waitCount: 5
			});
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
				waitCount: 5
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

		return (
			<Table.Row key={this.studentId}>
				<Table.Cell>
					<Header as='h2' textAlign='center'>{index + 1}</Header>
				</Table.Cell>
				<Table.Cell>
					<Header as='h2' textAlign='center'>{this.studentNick}</Header>
				</Table.Cell>
				<Table.Cell>
					<Header as='h2' textAlign='center'>{this.score}</Header>
				</Table.Cell>
			</Table.Row>
		);
	}

	render () {
		const { serverStatus, playQuestion, playTimeOut, playResult, playLeaderBoard } = this.props;
		const { waitCount } = this.state;

		return (
			<div className='teacher'>
				<div className='teacher-outer'>
					<div className='teacher-inner'>
						{ serverStatus === 'WAIT' &&
							<div>
								<Header as='h2' icon>
									<Icon name='hourglass start' />
									Ready to go!
									<Header.Subheader>
										{'Let\'s get busy'}
									</Header.Subheader>
								</Header>
								{
									waitCount &&
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
										Result
									<Header.Subheader>
										The answer is {playResult.answer}
									</Header.Subheader>
								</Header>
								<Segment.Group piled>
									<Segment>
										<Header as='h2' icon>
											{playResult.example1} people(s) chose the example 1
										</Header>
									</Segment>
									<Segment>
										<Header as='h2' icon>
											{playResult.example2} people(s) chose the example 2
										</Header>
									</Segment>
									<Segment>
										<Header as='h2' icon>
											{playResult.example3} people(s) chose the example 3
										</Header>
									</Segment>
									<Segment>
										<Header as='h2' icon>
											{playResult.example4} people(s) chose the example 4
										</Header>
									</Segment>
								</Segment.Group>
							</div>
						}
						{ serverStatus === 'LEADER_BOARD' &&
							<div>
								<Header as='h2' icon>
									<Icon name='trophy' />
										Leader Board
									<Header.Subheader>
										The score is.....
									</Header.Subheader>
								</Header>
								<Table celled selectable>
									<Table.Header>
										<Table.Row>
											<Table.HeaderCell>
												<Header as='h3' textAlign='center'>Ranking</Header>
											</Table.HeaderCell>
											<Table.HeaderCell>
												<Header as='h3' textAlign='center'>NickName</Header>
											</Table.HeaderCell>
											<Table.HeaderCell>
												<Header as='h3' textAlign='center'>Score</Header>
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
									Next Question
								</Button>
							</div>
						}
						{ serverStatus === 'END' &&
							<div>
								<Header as='h2' icon>
									<Icon name='trophy' />
										End of Play
									<Header.Subheader>
										Good job!
									</Header.Subheader>
								</Header>
								<Table celled selectable>
									<Table.Header>
										<Table.Row>
											<Table.HeaderCell>
												<Header as='h3' textAlign='center'>Ranking</Header>
											</Table.HeaderCell>
											<Table.HeaderCell>
												<Header as='h3' textAlign='center'>NickName</Header>
											</Table.HeaderCell>
											<Table.HeaderCell>
												<Header as='h3' textAlign='center'>Score</Header>
											</Table.HeaderCell>
										</Table.Row>
									</Table.Header>

									<Table.Body>
										{
											playLeaderBoard && playLeaderBoard.map(this.renderLeaderBoard, this)
										}
									</Table.Body>
								</Table>
							</div>
						}
					</div>
				</div>
			</div>
		);
	}
}

TeacherPlay.propTypes = {
	playId: PropTypes.number.isRequired,
	playQuestion: PropTypes.object.isRequired,
	playTimeOut: PropTypes.number.isRequired,
	playResult: PropTypes.object.isRequired,
	serverStatus: PropTypes.string.isRequired,
	playLeaderBoard: PropTypes.array.isRequired,
	callNextPlayQuestion: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
	serverStatus: state.serverStatus,
	playQuestion: state.playQuestion,
	playTimeOut: state.playTimeOut,
	playId: state.playId,
	playResult: state.playResult,
	playLeaderBoard: state.playLeaderBoard
});

const mapDispatchToProps = dispatch => ({
	callNextPlayQuestion (param) {
		dispatch(callNextPlayQuestion(param));
	}
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TeacherPlay));
