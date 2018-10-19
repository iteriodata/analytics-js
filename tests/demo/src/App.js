import React, { Component } from 'react';
import dumbBem from 'dumb-bem';
import tx from 'transform-props-with';
import { 
  BrowserRouter as Router,
  Route,
  NavLink
} from 'react-router-dom';

import { Page1 } from './Page1';
import { Page2 } from './Page2';

import logo from './logo.svg';
import './App.css';

const dumbApp = dumbBem('app');
const AppWrp = tx(dumbApp)('div');
const Header = tx([{ element: 'header' }, dumbApp])('div');
const Logo = tx([{ element: 'logo' }, dumbApp])('img');
const Title = tx([{ element: 'title' }, dumbApp])('h1');

const Navigation = tx([{ element: 'navigation' }, dumbApp])('div');

class App extends Component {
  render() {
    return (
      <Router>
        <AppWrp>
          <Header>
            <Logo src={logo} alt='logo' />
            <Title>Tracker demo</Title>
          </Header>
          <Navigation>
            <NavLink to={'/page1'}>Page1</NavLink>
            <NavLink to={'/page2'}>Page2</NavLink>
          </Navigation>
          <Route
            exact path='/page1'
            component={Page1} 
          />
          <Route
            exact path='/page2'
            component={Page2}
          />
        </AppWrp>
      </Router>
    );
  }
}

export default App;
