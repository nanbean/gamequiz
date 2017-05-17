import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
import { Divider, Input, Button, Grid, Checkbox, Image } from 'semantic-ui-react';
import { WithContext as ReactTags } from 'react-tag-input';

import TitleHeader from '../components/TitleHeader';

import { callGetTagSuggestions, callAddQuestion, callEditQuestion, callUploadImage } from '../actions';

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

		const { questionId, title, pictureUrl, example1, example2, example3, example4,
			answer, timer, quizCategory, tagSuggestions } = this.props;

		this.state = {
			questionId,
			title,
			pictureUrl,
			example1,
			example2,
			example3,
			example4,
			answer,
			timer,
			quizCategory,
			tagSuggestions
		};
	}

	componentDidMount () {
		this.props.callGetTagSuggestions({});
	}

	componentWillReceiveProps (nextProps) {
		const { questionId, title, pictureUrl, example1, example2, example3, example4,
			answer, timer, quizCategory, tagSuggestions } = nextProps;

		this.setState({
			questionId,
			title,
			pictureUrl,
			example1,
			example2,
			example3,
			example4,
			answer,
			timer,
			quizCategory,
			tagSuggestions
		});
	}

	onSaveButton () {
		const data = {};
		data.question = {};
		data.question.questionId = this.state.questionId;
		data.question.quizCategory = this.state.quizCategory;
		data.question.title = this.state.title;
		data.question.pictureUrl = this.state.pictureUrl;
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
			answer: Number(refs.label.substr(6, 1))
		});
	}

	handleDelete (i) {
		const quizCategory = this.state.quizCategory;
		quizCategory.splice(i, 1);
		this.setState({
			quizCategory
		});
	}

	handleAddition (tag) {
		const quizCategory = this.state.quizCategory;
		quizCategory.push({
			id: quizCategory.length + 1,
			text: tag
		});
		this.setState({
			quizCategory
		});
	}

	handleDrag (tag, currPos, newPos) {
		const quizCategory = this.state.quizCategory;

		quizCategory.splice(currPos, 1);
		quizCategory.splice(newPos, 0, tag);

		this.setState({
			quizCategory
		});
	}

	handleFileUpload (files) {
		this.props.callUploadImage({
			files,
			teacherId: this.props.teacherInfo.userID
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
								placeholder='Add new category'
								tags={this.state.quizCategory}
								suggestions={this.state.tagSuggestions}
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
								label='Title'
								placeholder='input Title'
								defaultValue={this.state.title}
								onChange={this.onTitleChange}
							/>
						</Grid.Column>
						<Grid.Column width={3}>
							<Input
								fluid
								label='Time Out'
								type='number'
								placeholder='input Time Out'
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
								<p>Try dropping some files here, or click to select files to upload.</p>
							</Dropzone>
						</Grid.Column>
						<Grid.Column width={10}>
							{
								this.state.pictureUrl &&
								<Image
									centered
									src={`/${this.state.pictureUrl}`}
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
								placeholder='Example 1'
								defaultValue={this.state.example1}
								onChange={this.onExample1Change}
							/>
						</Grid.Column>
						<Grid.Column width={2}>
							<Checkbox
								label='Answer1'
								checked={this.state.answer === 1}
								onChange={this.onAnswerChange}
							/>
						</Grid.Column>
						<Grid.Column width={6}>
							<Input
								fluid
								label='2'
								placeholder='Example 2'
								defaultValue={this.state.example2}
								onChange={this.onExample2Change}
							/>
						</Grid.Column>
						<Grid.Column width={2}>
							<Checkbox
								label='Answer2'
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
								placeholder='Example 3'
								defaultValue={this.state.example3}
								onChange={this.onExample3Change}
							/>
						</Grid.Column>
						<Grid.Column width={2}>
							<Checkbox
								label='Answer3'
								checked={this.state.answer === 3}
								onChange={this.onAnswerChange}
							/>
						</Grid.Column>
						<Grid.Column width={6}>
							<Input
								fluid
								label='4'
								placeholder='Example 4'
								defaultValue={this.state.example4}
								onChange={this.onExample4Change}
							/>
						</Grid.Column>
						<Grid.Column width={2}>
							<Checkbox
								label='Answer4'
								checked={this.state.answer === 4}
								onChange={this.onAnswerChange}
							/>
						</Grid.Column>
					</Grid.Row>
				</Grid>
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
	quizId: PropTypes.number.isRequired,
	questionId: PropTypes.number.isRequired,
	quizCategory: PropTypes.array.isRequired,
	title: PropTypes.string.isRequired,
	pictureUrl: PropTypes.string.isRequired,
	example1: PropTypes.string.isRequired,
	example2: PropTypes.string.isRequired,
	example3: PropTypes.string.isRequired,
	example4: PropTypes.string.isRequired,
	answer: PropTypes.number.isRequired,
	timer: PropTypes.number.isRequired,
	teacherInfo: PropTypes.object.isRequired,
	tagSuggestions: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
	teacherInfo: state.teacherInfo,
	quizId: state.quizId,
	questionId: state.question.questionId,
	quizCategory: state.question.quizCategory,
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
