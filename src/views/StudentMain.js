import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Input } from 'semantic-ui-react';

import '../styles/student.css';

class StudentMain extends Component {
	render () {
		return (
			<div className='student'>
				<div className='student-logo' />
				<Input size='huge' icon='send' placeholder='Type your game ID' />
			</div>
		);
	}
}

export default withRouter(connect(null)(StudentMain));
