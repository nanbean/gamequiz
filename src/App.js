import React, { Component } from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom'

import StudentMain from './views/StudentMain';
import TeacherMain from './views/TeacherMain';

import './App.css';

const Routing = () => (
	<Router>
		<div>
			<Route exact path="/" component={StudentMain}/>
			<Route path="/teacher" component={TeacherMain}/>
		</div>
		</Router>
)

class App extends Component {
	render() {
		return (
			<div className="App">
				 <Routing />
			</div>
		);
	}
}

export default App;
