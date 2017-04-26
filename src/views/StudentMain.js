import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux';

import quiz from '../quiz.png';
import '../styles/student.css';

class StudentMain extends Component {
	render () {
		return (
			<div className='student'>
				<img
					src={quiz}
					className='student-logo'
					alt='quiz'
				/>
				<div>
					<input
						className='student-palyid-input'
						placeholder='게임 숫자를 입력하세요.'
					/>
				</div>
				<div>
					<button
						className='student-palyid-button'
					>
						입장
					</button>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
});

export default withRouter(connect(mapStateToProps)(StudentMain))
