import React, { Component } from 'react';
import { withRouter, Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import { Header, Divider, Grid, List, Button, Table } from 'semantic-ui-react'

import Avatar from '../components/Avatar'
import TitleHeader from '../components/TitleHeader'

import { callGetQuizList, callGetFeedBackList } from '../actions';

import '../styles/teacher.css';

class TeacherMy extends Component {
	componentDidMount () {
		this.props.callGetQuizList({
			facebookUserID: this.props.teacherInfo.userID
		});
		this.props.callGetFeedBackList({
			facebookUserID: this.props.teacherInfo.userID
		});
	}

	renderQuiz (data) {
		return (
			<List.Item key={data.quizId}>
				<List.Content floated='right'>
					<Button content='Start' icon='play' labelPosition='left' />
					<Button content='Edit' icon='edit' labelPosition='left' />
				</List.Content>
				<List.Content floated='left'>
					<Header as='h2'>
						{data.quizTitle}
					</Header>
				</List.Content>
			</List.Item>
		);
	}

	renderFeedBack (data) {
		return (
			<Table.Row key={data.studentId}>
				<Table.Cell>
					{data.studentName}
				</Table.Cell>
				<Table.Cell>
					{data.wrongQuestionList.length}
				</Table.Cell>
			</Table.Row>
		);
	}

	render () {
		const { teacherInfo, getFeedBackList } = this.props;
		const avatarUrl = teacherInfo && teacherInfo.picture && teacherInfo.picture.data.url

		return (
			<div className='teacher'>
				{
					!teacherInfo.userID && <Redirect to='/teacher'/>
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
									this.props.getQuizList.map(this.renderQuiz, this)
								}
							</List>
							<Button
								fluid
								size='huge'
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
										getFeedBackList.map(this.renderFeedBack, this)
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

const mapStateToProps = (state) => ({
	teacherInfo: state.teacherInfo,
	getQuizList: state.getQuizList,
	getFeedBackList: state.getFeedBackList
});

const mapDispatchToProps = (dispatch) => ({
	callGetQuizList (param) {
		dispatch(callGetQuizList(param));
	},
	callGetFeedBackList (param) {
		dispatch(callGetFeedBackList(param));
	}
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TeacherMy))
