import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Header, Image, Dropdown, Modal, Button } from 'semantic-ui-react';

import { callUnRegisterTeacher, resetToMain } from '../actions';

import strings from '../resources/strings';

const options = [
	{ key: 'user', text: 'Account', icon: 'user', value: 'user' },
	{ key: 'settings', text: 'Settings', icon: 'settings', value: 'settings' },
	{ key: 'delete-account', text: 'Delete My Account', icon: 'remove user', value: 'delete-account' },
	{ key: 'sign-out', text: 'Sign Out', icon: 'sign out', value: 'sign-out' }
];

class Avatar extends Component {
	constructor (props) {
		super(props);

		this.onDropDownChange = this.onDropDownChange.bind(this);
		this.cancelDeleteAccount = this.cancelDeleteAccount.bind(this);
		this.confirmDeleteAccount = this.confirmDeleteAccount.bind(this);

		this.state = {
			deleteConfirm: false
		};
	}

	onDropDownChange (ev, refs) {
		if (refs.value === 'delete-account') {
			this.setState({
				deleteConfirm: true
			});
		} else 	if (refs.value === 'sign-out') {
			this.props.resetToMain();
			this.props.history.push('/teacher');
		}
	}

	confirmDeleteAccount () {
		this.props.callUnRegisterTeacher({
			teacherId: this.props.teacherId
		});
		this.props.resetToMain();
		this.props.history.push('/teacher');
	}

	cancelDeleteAccount () {
		this.setState({
			deleteConfirm: false
		});
	}

	render () {
		const { url, name } = this.props;

		return (
			<div>
				<Dropdown
					trigger={
						<Header as='h2'>
							<Image
								shape='circular'
								src={url}
							/>
							{' '}{name}
						</Header>
					}
					options={options}
					pointing='top left'
					icon={null}
					onChange={this.onDropDownChange}
				/>
				<Modal
					open={this.state.deleteConfirm}
				>
					<Modal.Header>
						{strings.deleteAccountConfirmHeader}
					</Modal.Header>
					<Modal.Content>
						{strings.deleteAccountConfirmContent}
					</Modal.Content>
					<Modal.Actions>
						<Button
							negative
							onClick={this.cancelDeleteAccount}
						>
							{strings.no}
						</Button>
						<Button
							positive
							onClick={this.confirmDeleteAccount}
						>
							{strings.yes}
						</Button>
					</Modal.Actions>
				</Modal>
			</div>
		);
	}
}

Avatar.propTypes = {
	history: PropTypes.object.isRequired,
	teacherId: PropTypes.string.isRequired,
	url: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	resetToMain: PropTypes.func.isRequired,
	callUnRegisterTeacher: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
	teacherId: state.teacherId
});

const mapDispatchToProps = dispatch => ({
	callUnRegisterTeacher (param) {
		dispatch(callUnRegisterTeacher(param));
	},
	resetToMain (param) {
		dispatch(resetToMain(param));
	}
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Avatar));
