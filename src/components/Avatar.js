import React from 'react';
import PropTypes from 'prop-types';
import { Header, Image } from 'semantic-ui-react'

const Avatar = ({ url, name }) => (
  <Header as='h2'>
    <Image
    	shape='circular'
    	src={url}
    />
		{' '}{name}
  </Header>
)

Avatar.propTypes = {
	name: PropTypes.string.isRequired
}

export default Avatar
