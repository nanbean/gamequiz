import React, { Component } from 'react';
import FacebookLogin from 'react-facebook-login';

import quiz from '../quiz.png';
import '../styles/teacher.css';

class TeacherMain extends Component {
	componentClicked () {
		console.log('componentClicked')
	}

	responseFacebook (ev) {
		console.log('responseFacebook', ev)
	}

	render () {
		return (
			<div className='teacher'>
				<img
					src={quiz}
					className='teacher-logo'
					alt='quiz'
				/>
				<h2>
					Welcome to GameQuiz
				</h2>
				<div>
					<FacebookLogin
						appId='1873315276258418'
						autoLoad={true}
						fields='name,email,picture'
						onClick={this.componentClicked}
						callback={this.responseFacebook}
					/>
				</div>
			</div>
		);
	}
}

export default TeacherMain;
