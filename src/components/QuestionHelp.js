import React from 'react';
import PropTypes from 'prop-types';
import { Popup, Image } from 'semantic-ui-react';

import question from '../assets/question.png';

const QuestionHelp = ({ content }) => (
	<Popup
		trigger={
			<Image src={question} size='mini' spaced />
		}
		on='hover'
		size='large'
		content={content}
	/>
);

QuestionHelp.propTypes = {
	content: PropTypes.string.isRequired
};

export default QuestionHelp;
