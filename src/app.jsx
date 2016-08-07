import "babel-polyfill";
import React from 'react';
import ReactDOM from 'react-dom';

import Clock from './Clock.jsx';


ReactDOM.render(
    <div style={{height: '100%'}}>
        <Clock />
    </div>,
  document.getElementById('app')
);

