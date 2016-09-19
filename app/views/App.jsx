import React from 'react';
import Alert from 'react-s-alert';

import Header from 'widgets/Header';
import Footer from 'widgets/Footer';

class AppView extends React.Component {
	render() {
		return (
			<div>
				<Alert stack={{limit: 3}} />
				<Header {...this.props}/>
				{this.props.children}
				<Footer {...this.props}/>
			</div>
		);
	}
}
AppView.propTypes = {
	children: React.PropTypes.object,
	params: React.PropTypes.object
};

module.exports = AppView;
