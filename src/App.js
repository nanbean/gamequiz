import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import StudentMain from './views/StudentMain';
import TeacherMain from './views/TeacherMain';
import TeacherMy from './views/TeacherMy';
import TeacherJoin from './views/TeacherJoin';
import TeacherQuizEdit from './views/TeacherQuizEdit';
import TeacherQuestionEdit from './views/TeacherQuestionEdit';
import TeacherMode from './views/TeacherMode';
import TeacherWait from './views/TeacherWait';

import './App.css';

const Routing = () => (
	<Switch>
		<Route exact path='/' component={StudentMain} />
		<Route path='/teacher' component={TeacherMain} />
		<Route path='/my' component={TeacherMy} />
		<Route path='/join' component={TeacherJoin} />
		<Route path='/quizedit/:id' component={TeacherQuizEdit} />
		<Route path='/questionedit/:id' component={TeacherQuestionEdit} />
		<Route path='/mode' component={TeacherMode} />
		<Route path='/wait' component={TeacherWait} />
	</Switch>
);

class App extends Component {
	render() {
		return (
			<div className='App'>
				<Routing />
			</div>
		);
	}
}

export default App;
