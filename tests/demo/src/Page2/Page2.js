import React, { Component } from 'react';

import dumbBem from 'dumb-bem';
import tx from 'transform-props-with';

import './Page2.css';


const dumbPage2 = dumbBem('page1');
const Page2Wrp = tx(dumbPage2)('div');

export class Page2 extends Component {
  render() {
    return (
      <Page2Wrp>
        <h1>Page2</h1>
        <form name='test'>
          <p>
            <b>Name:</b><br/>
            <input id='name' type='text' size='40'/><br/>
            <b>Password:</b><br/>
            <input id='password' type='password' size='40'/>
          </p>
          <p><b>Choose the browser:</b><br/>
          <input id='radio1' type='radio' name='browser' value='ie'/> Internet Explorer<br/>
          <input id='radio2' type='radio' name='browser' value='opera'/> Opera<br/>
          <input id='radio3' type='radio' name='browser' value='firefox'/> Firefox<br/>
          </p>
          <b>Check to agree:</b> <input id='checkbox' type='checkbox'/> <br/>
          <p>Comments<br/>
          <textarea name='comment' cols='40' rows='3'></textarea></p>
          <p><input type='submit' value='Send'/>
          <input type='reset' value='Clear'/></p>
        </form>
        <b>Outside of the form input:</b><br/>
        <input id='outside-input' type='text' size='40'/><br/>
      </Page2Wrp>
    );
  }
}
