import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { Header, Divider, Grid, List, Button, Table, Popup } from 'semantic-ui-react';
import { Scrollbars } from 'react-custom-scrollbars';

import Avatar from '../components/Avatar';
import TitleHeader from '../components/TitleHeader';
import QuestionHelp from '../components/QuestionHelp';

import { setQuizId, setQuizName, setQuiz, callGetQuizList, callGetFeedBackList, callDeleteQuiz, callAddQuiz } from '../actions';

import strings from '../resources/strings';
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
					<Popup
						trigger={
							<Button
								content={strings.start}
								icon='play'
								labelPosition='left'
								onClick={this.onQuizStartButton}
								target={quiz._id}
							/>
						}
						on='hover'
						size='large'
						content={strings.startGameHelp}
					/>
					<Popup
						trigger={
							<Button
								content={strings.edit}
								icon='edit'
								labelPosition='left'
								onClick={this.onQuizEditButton}
								target={quiz._id}
							/>
						}
						on='hover'
						size='large'
						content={strings.editQuizHelp}
					/>
					<Popup
						trigger={
							<Button
								content={strings.delete}
								icon='trash'
								labelPosition='left'
								onClick={this.onQuizDeleteButton}
								target={quiz._id}
							/>
						}
						on='hover'
						size='large'
						content={strings.deleteQuizHelp}
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

	renderFeedBack (feedback) {
		this.studentId = feedback.studentId;
		this.studentName = feedback.studentName;
		this.wrongQuestions = feedback.wrongQuestions;

		return (
			<Table.Row key={this.studentId}>
				<Table.Cell>
					{this.studentName}
				</Table.Cell>
				<Table.Cell>
					{this.wrongQuestions.length}
				</Table.Cell>
			</Table.Row>
		);
	}

	render () {
		const { teacherName, teacherImage, teacherId, feedBackList, getQuizList } = this.props;
		const quizList = getQuizList && getQuizList.quizList;

		return (
			<div className='teacher'>
				{
					!teacherId && <Redirect to='/teacher' />
				}
				<TitleHeader
					icon='user'
					title={strings.myGameQuiz}
				/>
				<Divider />
				{
					teacherName && teacherImage &&
					<Avatar
						url={teacherImage}
						name={teacherName}
					/>
				}
				<Grid divided='vertically'>
					<Grid.Row columns={2}>
						<Grid.Column>
							<Header as='h2'>
								{strings.quizList}
								<QuestionHelp content={strings.quizListHelp} />
							</Header>
							<Scrollbars
								autoHeight
								autoHeightMax={750}
							>
								<List divided verticalAlign='middle'>
									{
										quizList && quizList.map(this.renderQuiz, this)
									}
								</List>
								<div>
									<Popup
										trigger={
											<Button
												fluid
												size='huge'
												onClick={this.onQuizAddButton}
											>
												{strings.newQuiz}
											</Button>
										}
										on='hover'
										size='large'
										content={strings.newQuizHelp}
										position='bottom center'
									/>
								</div>
							</Scrollbars>
						</Grid.Column>
						<Grid.Column>
							<Header as='h2'>
								{strings.feedBackList}
								<QuestionHelp content={strings.feedBackListHelp} />
							</Header>
							<Scrollbars
								autoHeight
								autoHeightMax={750}
							>
								<Table celled selectable>
									<Table.Header>
										<Table.Row>
											<Table.HeaderCell>{strings.student}</Table.HeaderCell>
											<Table.HeaderCell>{strings.wrongCount}</Table.HeaderCell>
										</Table.Row>
									</Table.Header>

									<Table.Body>
										{
											feedBackList && feedBackList.map(this.renderFeedBack, this)
										}
									</Table.Body>
								</Table>
							</Scrollbars>
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
	teacherId: PropTypes.string.isRequired,
	teacherName: PropTypes.string.isRequired,
	teacherImage: PropTypes.string.isRequired,
	getQuizList: PropTypes.object.isRequired,
	feedBackList: PropTypes.arrayOf(PropTypes.object).isRequired,
	newQuizId: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
	teacherId: state.teacherId,
	teacherName: state.teacherName,
	teacherImage: state.teacherImage,
	getQuizList: state.getQuizList,
	feedBackList: state.feedBackList,
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
