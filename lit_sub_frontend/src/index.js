import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {
  BrowserRouter,
  Switch,
  Route
} from "react-router-dom";
import reportWebVitals from './reportWebVitals';
import Home from './components/home'
import Login from './components/login'
import Story from './components/story';

ReactDOM.render(
  <BrowserRouter>
        <Route exact path="/" render={(props) => <Home {...props} />} />
        <Route exact path="/login" render={(props) => <Login {...props} />}/>
        <Route path="/story/:story_id" render={(props) => <Story {...props}/>}/>
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
