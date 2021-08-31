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

ReactDOM.render(
  <BrowserRouter>
        {/* If the current URL is /about, this route is rendered
            while the rest are ignored */}
        <Route exact path="/" render={(props) => <Home {...props} />} />
        {/* If none of the previous routes render anything,
            this route acts as a fallback.

            Important: A route with path="/" will *always* match
            the URL because all URLs begin with a /. So that's
            why we put this one last of all */}
        <Route exact path="/login" render={(props) => <Login {...props} />}/>
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
