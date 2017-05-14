import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Loader, Grid, Header, Button, Icon, Segment, Table } from 'semantic-ui-react';

import { callNextPlayQuestion } from '../actions';

import '../styles/teacher.css';

class TeacherPlay extends Component {
	constructor (props) {
		super(props);

		this.onNextQuestionButton = this.onNextQuestionButton.bind(this);
	}

	onNextQuestionButton () {
		this.props.callNextPlayQuestion({
			playId: this.props.playId
		});
	}

	renderLeaderBoard (data) {
		return (
			<Table.Row key={data.studentId}>
				<Table.Cell>
					{data.studentNick}
				</Table.Cell>
				<Table.Cell>
					{data.score}
				</Table.Cell>
			</Table.Row>
		);
	}

	render () {
		const { serverStatus, playQuestion, playTimeOut, playResult, playLeaderBoard } = this.props;

		return (
			<div className='teacher'>
				{ serverStatus === 'WAIT' &&
					<div>
						<Header as='h2' icon>
							<Icon name='hourglass start' />
								Ready to go!
							<Header.Subheader>
								Let's get busy
							</Header.Subheader>
						</Header>
						<Loader active />
					</div>
				}
				{ serverStatus === 'PLAY' &&
					<div>
						<Grid divided='vertically'>
							<Grid.Row columns={1}>
								<Grid.Column>
									<Header
										as='h2'
										content={playQuestion.title}
									/>
								</Grid.Column>
							</Grid.Row>
							<Grid.Row columns={1}>
								<Grid.Column>
									<Header
										as='h2'
										content={playTimeOut}
									/>
								</Grid.Column>
							</Grid.Row>
							<Grid.Row columns={2}>
								<Grid.Column>
									<Header
										as='h2'
										content={playQuestion.example1}
									/>
								</Grid.Column>
								<Grid.Column>
									<Header
										as='h2'
										content={playQuestion.example2}
									/>
								</Grid.Column>
							</Grid.Row>
							<Grid.Row columns={2}>
								<Grid.Column>
									<Header
										as='h2'
										content={playQuestion.example3}
									/>
								</Grid.Column>
								<Grid.Column>
									<Header
										as='h2'
										content={playQuestion.example4}
									/>
								</Grid.Column>
							</Grid.Row>
						</Grid>
					</div>
				}
				{ serverStatus === 'RESULT' &&
					<div>
						<Loader active>RESULT</Loader>
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
						<Loader active>RESULT</Loader>
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
									<Table.HeaderCell>NickName</Table.HeaderCell>
									<Table.HeaderCell>Score</Table.HeaderCell>
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
						<Loader active>RESULT</Loader>
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
									<Table.HeaderCell>NickName</Table.HeaderCell>
									<Table.HeaderCell>Score</Table.HeaderCell>
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
