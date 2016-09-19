import React from 'react';
import Header from 'widgets/Header';

import Footer from 'widgets/Footer';
import Notifications from 'react-notify-toast';

class AppView extends React.Component {
	render() {
		return (
			<div>
				<Notifications />
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
