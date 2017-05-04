import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Divider, Input, Button, Grid, Checkbox } from 'semantic-ui-react';

import TitleHeader from '../components/TitleHeader';

import { callAddQuestion, callEditQuestion } from '../actions';

import '../styles/teacher.css';

class TeacherQuestionEdit extends Component {
	constructor (props) {
		super(props);

		this.state = this.props.question;
		this.onSaveButton = this.onSaveButton.bind(this);
		this.onCancelButton = this.onCancelButton.bind(this);
		this.onTitleChange = this.onTitleChange.bind(this);
		this.onTimerChange = this.onTimerChange.bind(this);
		this.onExample1Change = this.onExample1Change.bind(this);
		this.onExample2Change = this.onExample2Change.bind(this);
		this.onExample3Change = this.onExample3Change.bind(this);
		this.onExample4Change = this.onExample4Change.bind(this);
		this.onAnswerChange = this.onAnswerChange.bind(this);
	}

	onSaveButton () {
		const data = {};
		data.question = this.state;

		if (this.props.match.params.id === 'new') {
			data.quizId = this.props.quizId;

			this.props.callAddQuestion(data);
		} else {
			this.props.callEditQuestion(data);
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

	onTimerChange (e) {
		this.setState({
			timer: e.target.value
		});
	}

	onExample1Change (e) {
		this.setState({
			example1: e.target.value
		});
	}

	onExample2Change (e) {
		this.setState({
			example2: e.target.value
		});
	}

	onExample3Change (e) {
		this.setState({
			example3: e.target.value
		});
	}

	onExample4Change (e) {
		this.setState({
			example4: e.target.value
		});
	}

	onAnswerChange (e) {
		this.setState({
			answer: Number(e.target.textContent.substr(6, 1))
		});
	}

	render () {
		return (
			<div className='teacher'>
				<TitleHeader
					icon='edit'
					title='Question Edit'
				/>
				<Divider />
				<Grid divided='vertically'>
					<Grid.Row columns={1}>
						<Grid.Column>
							<Input
								fluid
								label='Title'
								placeholder='input Title'
								defaultValue={this.state.title}
								onChange={this.onTitleChange}
							/>
						</Grid.Column>
					</Grid.Row>
					<Grid.Row columns={1}>
						<Grid.Column>
							<Input
								label='Time Out'
								placeholder='input Time Out'
								defaultValue={this.state.timer}
								onChange={this.onTimerChange}
							/>
						</Grid.Column>
					</Grid.Row>
					<Grid.Row columns={2}>
						<Grid.Column>
							<Input
								label='1'
								placeholder='Example 1'
								defaultValue={this.state.example1}
								onChange={this.onExample1Change}
							/>
							<Checkbox
								label='Answer1'
								number={1}
								checked={this.state.answer === 1}
								onChange={this.onAnswerChange}
							/>
						</Grid.Column>
						<Grid.Column>
							<Input
								label='2'
								placeholder='Example 2'
								defaultValue={this.state.example2}
								onChange={this.onExample2Change}
							/>
							<Checkbox
								label='Answer2'
								number={2}
								checked={this.state.answer === 2}
								onChange={this.onAnswerChange}
							/>
						</Grid.Column>
					</Grid.Row>
					<Grid.Row columns={2}>
						<Grid.Column>
							<Input
								label='3'
								placeholder='Example 3'
								defaultValue={this.state.example3}
								onChange={this.onExample3Change}
							/>
							<Checkbox
								label='Answer3'
								number={3}
								checked={this.state.answer === 3}
								onChange={this.onAnswerChange}
							/>
						</Grid.Column>
						<Grid.Column>
							<Input
								label='4'
								placeholder='Example 4'
								defaultValue={this.state.example4}
								onChange={this.onExample4Change}
							/>
							<Checkbox
								label='Answer4'
								number={4}
								checked={this.state.answer === 4}
								onChange={this.onAnswerChange}
							/>
						</Grid.Column>
					</Grid.Row>
					<Button
						fluid
						size='huge'
						onClick={this.onSaveButton}
					>
						Save
					</Button>
					<Button
						fluid
						size='huge'
						onClick={this.onCancelButton}
					>
						Cancel
					</Button>
				</Grid>
			</div>
		);
	}
}

TeacherQuestionEdit.propTypes = {
	callEditQuestion: PropTypes.func.isRequired,
	callAddQuestion: PropTypes.func.isRequired,
	match: PropTypes.object.isRequired,
	history: PropTypes.object.isRequired,
	quizId: PropTypes.object.isRequired,
	question: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	quizId: state.quizId,
	question: state.question
});

const mapDispatchToProps = dispatch => ({
	callEditQuestion (param) {
		dispatch(callEditQuestion(param));
	},
	callAddQuestion (param) {
		dispatch(callAddQuestion(param));
	}
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TeacherQuestionEdit));
