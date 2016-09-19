import React from 'react';
import { observer } from "mobx-react";
import { Flex, Box } from 'reflexbox';
import { translate } from 'react-i18next';

@translate()
@observer(['main'])
class Footer extends React.Component {
	static propTypes = {
		main: React.PropTypes.object,
		t: React.PropTypes.func
	}

	render() {
		const t = this.props.t || (v => v);
		return (
			<footer id="footer">
				<Flex align="center" justify="space-between">
					<Box auto p={4}>
						<strong> Tvrbo.pro</strong> &ndash; {t('Some rights might eventually be reserved. Or not.')}
					</Box>
				</Flex>

			</footer>
		);
	}
}

module.exports = Footer;
