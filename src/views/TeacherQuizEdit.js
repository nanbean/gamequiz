import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Header, Divider, Grid, List, Button, Input, Popup } from 'semantic-ui-react';
import { Scrollbars } from 'react-custom-scrollbars';

import TitleHeader from '../components/TitleHeader';
import QuestionHelp from '../components/QuestionHelp';

import { setNewQuizId, setQuestion, callEditQuiz, callDeleteQuestion, callGetQuestionList } from '../actions';

import strings from '../resources/strings';
import '../styles/teacher.css';

class TeacherQuizEdit extends Component {
	constructor (props) {
		super(props);

		this.onSaveButton = this.onSaveButton.bind(this);
		this.onCancelButton = this.onCancelButton.bind(this);
		this.onTitleChange = this.onTitleChange.bind(this);
		this.onQuestionNewButton = this.onQuestionNewButton.bind(this);
		this.onQuestionEditButton = this.onQuestionEditButton.bind(this);
		this.onQuestionDeleteButton = this.onQuestionDeleteButton.bind(this);

		this.state = {
			title: this.props.quiz.quizTitle,
			showTitleHelp: false
		};
	}

	componentDidMount () {
		this.props.callGetQuestionList({
			quizId: this.props.match.params.id
		});
		this.props.setNewQuizId('');
	}

	componentWillReceiveProps (nextProps) {
		this.setState({
			title: nextProps.quiz.quizTitle
		});
	}

	onSaveButton () {
		const quiz = {};

		if (!this.state.title) {
			this.setState({
				showTitleHelp: true
			});
			return;
		}

		quiz._id = this.props.match.params.id;
		quiz.quizTitle = this.state.title;
		quiz.questionList = [];

		for (let i = 0; i < this.props.getQuestionList.questionList.length; i += 1) {
			quiz.questionList.push(this.props.getQuestionList.questionList[i]._id);
		}

		if (this.props.match.params.id === 'new') {
			quiz._id = this.props.newQuizId;
			this.props.callEditQuiz({
				quiz
			});
		} else {
			this.props.callEditQuiz({
				quiz
			});
		}
		this.props.history.goBack();
	}

	onCancelButton () {
		this.props.history.goBack();
	}

	onTitleChange (e) {
		this.setState({
			title: e.target.value
		});
	}

	onQuestionEditButton (ev) {
		const { id } = ev.target;
		const questionList = this.props.getQuestionList && this.props.getQuestionList.questionList;
		const data = questionList.find(item => item._id === id);

		this.props.setQuestion(data);
		this.props.history.push(`/questionedit/${id}`);
	}

	onQuestionNewButton () {
		this.props.setQuestion(null);
		this.props.history.push('/questionedit/new');
	}

	onQuestionDeleteButton (ev) {
		const { id } = ev.target;

		this.props.callDeleteQuestion({
			teacherId: this.props.teacherId,
			quizId: this.props.match.params.id,
			questionId: id
		});
	}

	renderQuestion (question) {
		return (
			<List.Item key={question._id}>
				<List.Content floated='right'>
					<Popup
						trigger={
							<Button
								id={question._id}
								content={strings.edit}
								icon='edit'
								labelPosition='left'
								onClick={this.onQuestionEditButton}
							/>
						}
						on='hover'
						size='large'
						content={strings.editQuestionHelp}
					/>
					<Popup
						trigger={
							<Button
								id={question._id}
								content={strings.delete}
								icon='trash'
								labelPosition='left'
								onClick={this.onQuestionDeleteButton}
							/>
						}
						on='hover'
						size='large'
						content={strings.deleteQuestionHelp}
					/>
				</List.Content>
				<List.Content className='teacher-quizlist-title-wrapper' floated='left'>
					<Header className='teacher-quizlist-title' as='h2'>
						{question.title}
					</Header>
				</List.Content>
			</List.Item>
		);
	}

	render () {
		const { getQuestionList } = this.props;
		const questionList = getQuestionList && getQuestionList.questionList;

		return (
			<div className='teacher-normal'>
				<TitleHeader
					icon='edit'
					title={strings.quizEdit}
				/>
				<Divider />
				<Grid divided='vertically'>
					<Grid.Row columns={1}>
						<Grid.Column>
							<Input
								className='teacher-quizname-input'
								size='huge'
								placeholder={strings.quizName}
								defaultValue={this.state.title}
								onChange={this.onTitleChange}
							/>
							{
								this.state.showTitleHelp &&
								<Header as='h4' color='red' content={strings.titleError} />
							}
						</Grid.Column>
					</Grid.Row>
					<Grid.Row columns={1}>
						<Grid.Column>
							<Header as='h2'>
								{strings.questionList}
								<QuestionHelp content={strings.questionListHelp} />
							</Header>
							<Scrollbars
								autoHeight
								autoHeightMax={650}
							>
								<List divided verticalAlign='middle'>
									{
										questionList && questionList.map(this.renderQuestion, this)
									}
								</List>
								<Popup
									trigger={
										<div className='teacher-button'>
											<Button
												fluid
												size='huge'
												onClick={this.onQuestionNewButton}
											>
												{strings.newQuestion}
											</Button>
										</div>
									}
									on='hover'
									size='large'
									content={strings.newQuestionHelp}
								/>
								<Popup
									trigger={
										<div className='teacher-button'>
											<Button
												fluid
												size='huge'
												onClick={this.onSaveButton}
											>
												{strings.save}
											</Button>
										</div>
									}
									on='hover'
									size='large'
									content={strings.quizSaveHelp}
								/>
								<Popup
									trigger={
										<div className='teacher-button'>
											<Button
												fluid
												size='huge'
												onClick={this.onCancelButton}
											>
												{strings.cancel}
											</Button>
										</div>
									}
									on='hover'
									size='large'
									content={strings.quizCancelHelp}
								/>
							</Scrollbars>
						</Grid.Column>
					</Grid.Row>
				</Grid>
			</div>
		);
	}
}

TeacherQuizEdit.propTypes = {
	callGetQuestionList: PropTypes.func.isRequired,
	callEditQuiz: PropTypes.func.isRequired,
	callDeleteQuestion: PropTypes.func.isRequired,
	setNewQuizId: PropTypes.func.isRequired,
	setQuestion: PropTypes.func.isRequired,
	history: PropTypes.object.isRequired,
	match: PropTypes.object.isRequired,
	teacherId: PropTypes.string.isRequired,
	quiz: PropTypes.object.isRequired,
	newQuizId: PropTypes.string.isRequired,
	getQuestionList: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	teacherId: state.teacherId,
	quiz: state.quiz,
	newQuizId: state.newQuizId,
	getQuestionList: state.getQuestionList
});

const mapDispatchToProps = dispatch => ({
	callEditQuiz (param) {
		dispatch(callEditQuiz(param));
	},
	callDeleteQuestion (param) {
		dispatch(callDeleteQuestion(param));
	},
	callGetQuestionList (param) {
		dispatch(callGetQuestionList(param));
	},
	setQuestion (param) {
		dispatch(setQuestion(param));
	},
	setNewQuizId (param) {
		dispatch(setNewQuizId(param));
	}
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TeacherQuizEdit));
