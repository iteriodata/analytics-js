import React, { Component } from 'react';

import dumbBem from 'dumb-bem';
import tx from 'transform-props-with';

import './Page1.css';


const dumbPage1 = dumbBem('page1');
const Page1Wrp = tx(dumbPage1)('div');

export class Page1 extends Component {
  render() {
    return (
      <Page1Wrp>
        <h1>Page1</h1>
        <div className='long-content'/>
      </Page1Wrp>
    );
  }
}
