import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
import { Divider, Input, Button, Grid, Checkbox, Image, Header } from 'semantic-ui-react';
import { WithContext as ReactTags } from 'react-tag-input';

import TitleHeader from '../components/TitleHeader';

import { callGetTagSuggestions, callAddQuestion, callEditQuestion, callUploadImage } from '../actions';

import strings from '../resources/strings';
import '../styles/teacher.css';

class TeacherQuestionEdit extends Component {
	constructor (props) {
		super(props);

		this.onSaveButton = this.onSaveButton.bind(this);
		this.onCancelButton = this.onCancelButton.bind(this);
		this.onTitleChange = this.onTitleChange.bind(this);
		this.onTimerChange = this.onTimerChange.bind(this);
		this.onExample1Change = this.onExample1Change.bind(this);
		this.onExample2Change = this.onExample2Change.bind(this);
		this.onExample3Change = this.onExample3Change.bind(this);
		this.onExample4Change = this.onExample4Change.bind(this);
		this.onAnswerChange = this.onAnswerChange.bind(this);
		this.handleDelete = this.handleDelete.bind(this);
		this.handleAddition = this.handleAddition.bind(this);
		this.handleDrag = this.handleDrag.bind(this);
		this.handleFileUpload = this.handleFileUpload.bind(this);

		const { questionId, title, example1, example2, example3, example4,
			answer, timer, category } = this.props;

		this.state = {
			questionId,
			title,
			example1,
			example2,
			example3,
			example4,
			answer,
			timer,
			category,
			showTitleHelp: false,
			showExampleHelp: false,
			showAnswerHelp: false
		};
	}

	componentDidMount () {
		this.props.callGetTagSuggestions({});
	}

	onSaveButton () {
		const data = {};
		const showTitleHelp = !this.state.title;
		const showExampleHelp = !this.state.example1 || !this.state.example2 ||
														!this.state.example3 || !this.state.example4;
		const showAnswerHelp = this.state.answer === -1;

		this.setState({
			showTitleHelp,
			showExampleHelp,
			showAnswerHelp
		});

		if (showTitleHelp || showExampleHelp || showAnswerHelp) {
			return;
		}

		data.question = {};
		data.question._id = this.state.questionId;
		data.question.category = this.state.category;
		data.question.title = this.state.title;
		data.question.pictureUrl = this.props.pictureUrl;
		data.question.example1 = this.state.example1;
		data.question.example2 = this.state.example2;
		data.question.example3 = this.state.example3;
		data.question.example4 = this.state.example4;
		data.question.answer = this.state.answer;
		data.question.timer = this.state.timer;

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

	onTimerChange (ev) {
		this.setState({
			timer: ev.target.value
		});
	}

	onExample1Change (ev) {
		this.setState({
			example1: ev.target.value
		});
	}

	onExample2Change (ev) {
		this.setState({
			example2: ev.target.value
		});
	}

	onExample3Change (ev) {
		this.setState({
			example3: ev.target.value
		});
	}

	onExample4Change (ev) {
		this.setState({
			example4: ev.target.value
		});
	}

	onAnswerChange (ev, refs) {
		this.setState({
			answer: Number(refs.label.substr(refs.label.length - 1, 1))
		});
	}

	handleDelete (i) {
		const category = this.state.category;
		category.splice(i, 1);
		this.setState({
			category
		});
	}

	handleAddition (tag) {
		const category = this.state.category;
		category.push({
			id: category.length + 1,
			text: tag
		});
		this.setState({
			category
		});
	}

	handleDrag (tag, currPos, newPos) {
		const category = this.state.category;

		category.splice(currPos, 1);
		category.splice(newPos, 0, tag);

		this.setState({
			category
		});
	}

	handleFileUpload (files) {
		this.props.callUploadImage({
			files,
			teacherId: this.props.teacherId
		});
	}

	render () {
		return (
			<div className='teacher'>
				<TitleHeader
					icon='edit'
					title={strings.questionEdit}
				/>
				<Divider />
				<Grid celled>
					<Grid.Row>
						<Grid.Column>
							<ReactTags
								classNames={{
									tags: '',
									tagInput: 'teacher-tag-input ui labeled input',
									tagInputField: '',
									selected: '',
									tag: 'teacher-tag ui label',
									remove: 'removeClass',
									suggestions: 'teacher-tag-suggestions',
									activeSuggestion: 'teacher-tag-active-suggestion'
								}}
								placeholder={strings.addNewCategory}
								tags={this.state.category}
								suggestions={this.props.tagSuggestions}
								handleDelete={this.handleDelete}
								handleAddition={this.handleAddition}
								handleDrag={this.handleDrag}
							/>
						</Grid.Column>
					</Grid.Row>
					<Grid.Row>
						<Grid.Column width={13}>
							<Input
								fluid
								label={strings.title}
								placeholder={strings.inputTitle}
								defaultValue={this.state.title}
								onChange={this.onTitleChange}
							/>
							{
								this.state.showTitleHelp &&
								<Header as='h4' color='red' content={strings.questionTitleError} />
							}
						</Grid.Column>
						<Grid.Column width={3}>
							<Input
								fluid
								label={strings.timeOut}
								type='number'
								placeholder={strings.inputTimeOut}
								defaultValue={this.state.timer}
								onChange={this.onTimerChange}
							/>
						</Grid.Column>
					</Grid.Row>
					<Grid.Row>
						<Grid.Column width={6}>
							<Dropzone
								className='teacher-dropzone'
								multiple={false}
								accept='image/*'
								onDrop={this.handleFileUpload}
							>
								<p>{strings.imageUploadHelp}</p>
							</Dropzone>
						</Grid.Column>
						<Grid.Column width={10}>
							{
								this.props.pictureUrl &&
								<Image
									centered
									src={`/${this.props.pictureUrl}`}
									height={200}
								/>
							}
						</Grid.Column>
					</Grid.Row>
				</Grid>
				<Grid celled>
					<Grid.Row>
						<Grid.Column width={6}>
							<Input
								fluid
								label='1'
								placeholder={strings.example1}
								defaultValue={this.state.example1}
								onChange={this.onExample1Change}
							/>
						</Grid.Column>
						<Grid.Column width={2}>
							<Checkbox
								label={strings.answer1}
								checked={this.state.answer === 1}
								onChange={this.onAnswerChange}
							/>
						</Grid.Column>
						<Grid.Column width={6}>
							<Input
								fluid
								label='2'
								placeholder={strings.example2}
								defaultValue={this.state.example2}
								onChange={this.onExample2Change}
							/>
						</Grid.Column>
						<Grid.Column width={2}>
							<Checkbox
								label={strings.answer2}
								checked={this.state.answer === 2}
								onChange={this.onAnswerChange}
							/>
						</Grid.Column>
					</Grid.Row>
					<Grid.Row>
						<Grid.Column width={6}>
							<Input
								fluid
								label='3'
								placeholder={strings.example3}
								defaultValue={this.state.example3}
								onChange={this.onExample3Change}
							/>
						</Grid.Column>
						<Grid.Column width={2}>
							<Checkbox
								label={strings.answer3}
								checked={this.state.answer === 3}
								onChange={this.onAnswerChange}
							/>
						</Grid.Column>
						<Grid.Column width={6}>
							<Input
								fluid
								label='4'
								placeholder={strings.example4}
								defaultValue={this.state.example4}
								onChange={this.onExample4Change}
							/>
						</Grid.Column>
						<Grid.Column width={2}>
							<Checkbox
								label={strings.answer4}
								checked={this.state.answer === 4}
								onChange={this.onAnswerChange}
							/>
						</Grid.Column>
					</Grid.Row>
				</Grid>
				{
					this.state.showExampleHelp &&
					<Header as='h4' color='red' content={strings.exampleError} />
				}
				{
					this.state.showAnswerHelp &&
					<Header as='h4' color='red' content={strings.answerError} />
				}
				<div className='teacher-button'>
					<Button
						fluid
						size='huge'
						onClick={this.onSaveButton}
					>
						{strings.save}
					</Button>
				</div>
				<div className='teacher-button'>
					<Button
						fluid
						size='huge'
						onClick={this.onCancelButton}
					>
						{strings.cancel}
					</Button>
				</div>
			</div>
		);
	}
}

TeacherQuestionEdit.propTypes = {
	callGetTagSuggestions: PropTypes.func.isRequired,
	callEditQuestion: PropTypes.func.isRequired,
	callAddQuestion: PropTypes.func.isRequired,
	callUploadImage: PropTypes.func.isRequired,
	match: PropTypes.object.isRequired,
	history: PropTypes.object.isRequired,
	quizId: PropTypes.string.isRequired,
	questionId: PropTypes.string,
	category: PropTypes.array.isRequired,
	title: PropTypes.string.isRequired,
	pictureUrl: PropTypes.string.isRequired,
	example1: PropTypes.string.isRequired,
	example2: PropTypes.string.isRequired,
	example3: PropTypes.string.isRequired,
	example4: PropTypes.string.isRequired,
	answer: PropTypes.number.isRequired,
	timer: PropTypes.number.isRequired,
	teacherId: PropTypes.string.isRequired,
	tagSuggestions: PropTypes.array.isRequired
};

TeacherQuestionEdit.defaultProps = {
	questionId: ''
};

const mapStateToProps = state => ({
	teacherId: state.teacherId,
	quizId: state.quizId,
	questionId: state.question._id,
	category: state.question.category,
	title: state.question.title,
	pictureUrl: state.question.pictureUrl,
	example1: state.question.example1,
	example2: state.question.example2,
	example3: state.question.example3,
	example4: state.question.example4,
	answer: state.question.answer,
	timer: state.question.timer,
	tagSuggestions: state.tagSuggestions
});

const mapDispatchToProps = dispatch => ({
	callGetTagSuggestions (param) {
		dispatch(callGetTagSuggestions(param));
	},
	callEditQuestion (param) {
		dispatch(callEditQuestion(param));
	},
	callAddQuestion (param) {
		dispatch(callAddQuestion(param));
	},
	callUploadImage (param) {
		dispatch(callUploadImage(param));
	}
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TeacherQuestionEdit));
