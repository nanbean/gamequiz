import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Header, Divider, Grid, List, Button } from 'semantic-ui-react';

import TitleHeader from '../components/TitleHeader';

import { setQuestion, callGetQuestionList } from '../actions';

import '../styles/teacher.css';

class TeacherQuizEdit extends Component {
	constructor (props) {
		super(props);

		this.onQuestionNewButton = this.onQuestionNewButton.bind(this);
		this.onQuestionEditButton = this.onQuestionEditButton.bind(this);
	}

	componentDidMount () {
		this.props.callGetQuestionList({
			quizId: this.props.match.params.id
		});
	}

	onQuestionEditButton (ev, refs) {
		const questionList = this.props.getQuestionList && this.props.getQuestionList.questionList;
		const data = questionList.find(item => item.questionId === refs.target);
		this.props.setQuestion(data);
		this.props.history.push(`/questionedit/${refs.target}`);
	}

	onQuestionNewButton () {
		this.props.setQuestion(null);
		this.props.history.push('/questionedit/new');
	}

	renderQuestion (data) {
		return (
			<List.Item key={data.questionId}>
				<List.Content floated='right'>
					<Button
						content='Edit'
						icon='edit'
						labelPosition='left'
						onClick={this.onQuestionEditButton}
						target={data.questionId}
					/>
					<Button content='Delete' icon='trash' labelPosition='left' />
				</List.Content>
				<List.Content floated='left'>
					<Header as='h2'>
						{data.title}
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
							<Header as='h2'>
								Question List
							</Header>
							<List divided verticalAlign='middle'>
								{
									questionList && questionList.map(this.renderQuestion, this)
								}
							</List>
							<Button
								fluid
								size='huge'
								onClick={this.onQuestionNewButton}
							>
								New Question
							</Button>
						</Grid.Column>
					</Grid.Row>
				</Grid>
			</div>
		);
	}
}

TeacherQuizEdit.propTypes = {
	callGetQuestionList: PropTypes.func.isRequired,
	setQuestion: PropTypes.func.isRequired,
	history: PropTypes.object.isRequired,
	match: PropTypes.object.isRequired,
	getQuestionList: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
	getQuestionList: state.getQuestionList
});

const mapDispatchToProps = dispatch => ({
	callGetQuestionList (param) {
		dispatch(callGetQuestionList(param));
	},
	setQuestion (param) {
		dispatch(setQuestion(param));
	}
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TeacherQuizEdit));
