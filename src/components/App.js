import React from 'react';
import { Route, Link } from 'react-router-dom';

import './../scss/style.scss';

class App extends React.Component {
	constructor() {
		super();
	}

	render() {
		const Home = () => (<div className='wrrs-wrapper__heading'>Home</div>);
		const One = () => (<div className='wrrs-wrapper__heading'>Page One</div>);
		const Two = () => (<div className='wrrs-wrapper__heading'>Page Two</div>);

		return (
			<div className='wrrs-wrapper'>
				<img src={require('./../img/logo.svg')} className='wrrs-wrapper__logo' alt='logo' />
				<div className='wrrs-wrapper__heading'>Hello, world!</div>

				<Route exact path='/' component={Home} />
				<Route path='/one' component={One} />
				<Route path='/two' component={Two} />

				<Link to='/'>Home</Link>
				<Link to='/one'>One</Link>
				<Link to='/two'>Two</Link>
			</div>
		);
	}
}

export default App;
