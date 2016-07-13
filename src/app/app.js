import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store';
import router from './router/Router';

// Notice that we've organized all of our routes into a separate file.


// Now we can attach the router to the 'root' element like this:
ReactDOM.render(
  <Provider store={store}>{router}</Provider>,
  document.getElementById('root')
);