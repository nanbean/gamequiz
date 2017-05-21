import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { Header, Divider, Grid, List, Button, Table } from 'semantic-ui-react';

import Avatar from '../components/Avatar';
import TitleHeader from '../components/TitleHeader';

import { setQuizId, setQuizName, setQuiz, callGetQuizList, callGetFeedBackList, callDeleteQuiz, callAddQuiz } from '../actions';

import '../styles/teacher.css';

class TeacherMy extends Component {
	constructor (props) {
		super(props);

		this.onQuizEditButton = this.onQuizEditButton.bind(this);
		this.onQuizAddButton = this.onQuizAddButton.bind(this);
		this.onQuizStartButton = this.onQuizStartButton.bind(this);
		this.onQuizDeleteButton = this.onQuizDeleteButton.bind(this);
	}

	componentDidMount () {
		const { history } = this.props;

		if (history.action !== 'POP') {
			this.props.callGetQuizList({
				teacherId: this.props.teacherId
			});
			this.props.callGetFeedBackList({
				teacherId: this.props.teacherId
			});
		}
	}

	componentWillReceiveProps (nextProps) {
		const { newQuizId } = nextProps;

		if (newQuizId) {
			this.props.history.push(`/quizedit/${newQuizId}`);
		}
	}

	onQuizAddButton () {
		const quiz = {};
		quiz.quizTitle = '';
		quiz.questionList = [];

		this.props.callAddQuiz({
			teacherId: this.props.teacherId,
			quiz
		});
	}

	onQuizEditButton (ev, refs) {
		const { getQuizList } = this.props;
		this.props.setQuizId(refs.target);
		for (let i = 0; i < getQuizList.quizList.length; i += 1) {
			if (getQuizList.quizList[i]._id === refs.target) {
				this.props.setQuiz(getQuizList.quizList[i]);
			}
		}
		this.props.history.push(`/quizedit/${refs.target}`);
	}

	onQuizDeleteButton (ev, refs) {
		this.props.callDeleteQuiz({
			teacherId: this.props.teacherId,
			quizId: refs.target
		});
	}

	onQuizStartButton (ev, refs) {
		const { getQuizList } = this.props;

		this.props.setQuizId(refs.target);
		for (let i = 0; i < getQuizList.quizList.length; i += 1) {
			if (getQuizList.quizList[i]._id === refs.target) {
				this.props.setQuizName(getQuizList.quizList[i].quizTitle);
			}
		}
		this.props.history.push('/mode/');
	}

	renderQuiz (quiz) {
		return (
			<List.Item key={quiz._id}>
				<List.Content floated='right'>
					<Button
						content='Start'
						icon='play'
						labelPosition='left'
						onClick={this.onQuizStartButton}
						target={quiz._id}
					/>
					<Button
						content='Edit'
						icon='edit'
						labelPosition='left'
						onClick={this.onQuizEditButton}
						target={quiz._id}
					/>
					<Button
						content='Delete'
						icon='trash'
						labelPosition='left'
						onClick={this.onQuizDeleteButton}
						target={quiz._id}
					/>
				</List.Content>
				<List.Content floated='left'>
					<Header as='h2'>
						{quiz.quizTitle}
					</Header>
				</List.Content>
			</List.Item>
		);
	}

	renderFeedBack (data) {
		this.studentId = data.studentId;
		this.studentName = data.studentName;
		this.wrongQuestionList = data.wrongQuestionList;

		return (
			<Table.Row key={this.studentId}>
				<Table.Cell>
					{this.studentName}
				</Table.Cell>
				<Table.Cell>
					{this.wrongQuestionList.length}
				</Table.Cell>
			</Table.Row>
		);
	}

	render () {
		const { teacherInfo, teacherId, getFeedBackList, getQuizList } = this.props;
		const avatarUrl = teacherInfo && teacherInfo.picture && teacherInfo.picture.data.url;
		const quizList = getQuizList && getQuizList.quizList;
		const feedBackList = getFeedBackList && getFeedBackList.feedBackList;

		return (
			<div className='teacher'>
				{
					!teacherId && <Redirect to='/teacher' />
				}
				<TitleHeader
					icon='user'
					title='My GameQuiz'
				/>
				<Divider />
				{
					avatarUrl &&
					<Avatar
						url={teacherInfo.picture.data.url}
						name={teacherInfo.name}
					/>
				}
				<Grid divided='vertically'>
					<Grid.Row columns={2}>
						<Grid.Column>
							<Header as='h2'>
								Quiz List
							</Header>
							<List divided verticalAlign='middle'>
								{
									quizList && quizList.map(this.renderQuiz, this)
								}
							</List>
							<Button
								fluid
								size='huge'
								onClick={this.onQuizAddButton}
							>
								New Quiz
							</Button>
						</Grid.Column>
						<Grid.Column>
							<Header as='h2'>
								Feedback List
							</Header>
							<Table celled selectable>
								<Table.Header>
									<Table.Row>
										<Table.HeaderCell>Student</Table.HeaderCell>
										<Table.HeaderCell>Wrong Count</Table.HeaderCell>
									</Table.Row>
								</Table.Header>

								<Table.Body>
									{
										feedBackList && feedBackList.map(this.renderFeedBack, this)
									}
								</Table.Body>
							</Table>
						</Grid.Column>
					</Grid.Row>
				</Grid>
			</div>
		);
	}
}

TeacherMy.propTypes = {
	callGetQuizList: PropTypes.func.isRequired,
	callGetFeedBackList: PropTypes.func.isRequired,
	callAddQuiz: PropTypes.func.isRequired,
	callDeleteQuiz: PropTypes.func.isRequired,
	history: PropTypes.object.isRequired,
	setQuizId: PropTypes.func.isRequired,
	setQuizName: PropTypes.func.isRequired,
	setQuiz: PropTypes.func.isRequired,
	teacherInfo: PropTypes.object.isRequired,
	teacherId: PropTypes.string.isRequired,
	getQuizList: PropTypes.object.isRequired,
	getFeedBackList: PropTypes.object.isRequired,
	newQuizId: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
	teacherInfo: state.teacherInfo,
	teacherId: state.teacherId,
	getQuizList: state.getQuizList,
	getFeedBackList: state.getFeedBackList,
	newQuizId: state.newQuizId
});

const mapDispatchToProps = dispatch => ({
	setQuizId (param) {
		dispatch(setQuizId(param));
	},
	setQuizName (param) {
		dispatch(setQuizName(param));
	},
	setQuiz (param) {
		dispatch(setQuiz(param));
	},
	callGetQuizList (param) {
		dispatch(callGetQuizList(param));
	},
	callGetFeedBackList (param) {
		dispatch(callGetFeedBackList(param));
	},
	callDeleteQuiz (param) {
		dispatch(callDeleteQuiz(param));
	},
	callAddQuiz (param) {
		dispatch(callAddQuiz(param));
	}
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TeacherMy));
