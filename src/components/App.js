import React from 'react';
import { Route, Routes, Link } from 'react-router-dom';

import logo from '../img/logo.svg';

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
                <img src={logo} className='wrrs-wrapper__logo' alt='logo' />
                <div className='wrrs-wrapper__heading'>Hello, world!</div>

                <Routes>
                    <Route exact path='/' element={<Home />} />
                    <Route path='/one' element={<One />} />
                    <Route path='/two' element={<Two />} />
                </Routes>

                <Link to='/'>Home</Link>
                <Link to='/one'>One</Link>
                <Link to='/two'>Two</Link>
            </div>
        );
    }
}

export default App;
