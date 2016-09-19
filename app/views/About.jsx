import React from 'react';
import { Flex, Box } from 'reflexbox';
import { translate } from 'react-i18next';

@translate()
class About extends React.Component {
	static propTypes = {
		t: React.PropTypes.func
	};
	render() {
		const t = this.props.t || (v => v);

		return (
			<div id="about">
				<Flex align="center" justify="space-between">
					<Box px={4}>
						<h1>{t('About')}</h1>
					</Box>
				</Flex>
				<Flex align="center" justify="space-between">
					<Box px={4}>
						<p>{t('Your content here')}</p>
					</Box>
				</Flex>
			</div>
		);
	}
}

module.exports = About;
