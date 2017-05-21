import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Header, Divider, Grid, List, Button, Input } from 'semantic-ui-react';

import TitleHeader from '../components/TitleHeader';

import { setNewQuizId, setQuestion, callEditQuiz, callDeleteQuestion, callGetQuestionList } from '../actions';

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
			title: this.props.quiz.quizTitle
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

	onQuestionEditButton (ev, refs) {
		const questionList = this.props.getQuestionList && this.props.getQuestionList.questionList;
		const data = questionList.find(item => item._id === refs.target);
		this.props.setQuestion(data);
		this.props.history.push(`/questionedit/${refs.target}`);
	}

	onQuestionNewButton () {
		this.props.setQuestion(null);
		this.props.history.push('/questionedit/new');
	}

	onQuestionDeleteButton (ev, refs) {
		this.props.callDeleteQuestion({
			teacherId: this.props.teacherId,
			quizId: this.props.match.params.id,
			questionId: refs.target
		});
	}

	renderQuestion (question) {
		return (
			<List.Item key={question._id}>
				<List.Content floated='right'>
					<Button
						content='Edit'
						icon='edit'
						labelPosition='left'
						onClick={this.onQuestionEditButton}
						target={question._id}
					/>
					<Button
						content='Delete'
						icon='trash'
						labelPosition='left'
						onClick={this.onQuestionDeleteButton}
						target={question._id}
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
			<div className='teacher'>
				<TitleHeader
					icon='edit'
					title='Quiz Edit'
				/>
				<Divider />
				<Grid divided='vertically'>
					<Grid.Row columns={1}>
						<Grid.Column>
							<Input
								className='teacher-quizname-input'
								size='huge'
								placeholder='Quiz Name'
								defaultValue={this.state.title}
								onChange={this.onTitleChange}
							/>
							<Header as='h2'>
								Question List
							</Header>
							<List divided verticalAlign='middle'>
								{
									questionList && questionList.map(this.renderQuestion, this)
								}
							</List>
							<div className='teacher-button'>
								<Button
									fluid
									size='huge'
									onClick={this.onQuestionNewButton}
								>
									New Question
								</Button>
							</div>
							<div className='teacher-button'>
								<Button
									fluid
									size='huge'
									onClick={this.onSaveButton}
								>
									Save
								</Button>
							</div>
							<div className='teacher-button'>
								<Button
									fluid
									size='huge'
									onClick={this.onCancelButton}
								>
									Cancel
								</Button>
							</div>
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
