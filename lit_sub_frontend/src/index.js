import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {
  BrowserRouter,
  Switch,
  Route
} from "react-router-dom";
import reportWebVitals from './reportWebVitals';
import StoryView from "./components/story-view";
import Home from './components/home';
import Login from './components/login';
import Story from './components/story';
import StorySubmit from './components/story-submit';
import Register from './components/register';
import MyAccount from './components/account';
import AuthorView from './components/author_view';
import Author from './components/author';
import StoryEdit from './components/story-edit';
import {v4 as uuid} from 'uuid';
import Search from './components/search';

ReactDOM.render(
  <BrowserRouter>
        <Route exact path="/author/:author_id" render={(props) => <Author {...props}/>}/>
        <Route exact path="/" render={(props) => <Home {...props} key={uuid()}/>} />
        <Route exact path="/search" render={(props) => <Search {...props}/>}/>
        <Route exact path="/authors" render={(props) => <AuthorView {...props}/>}/>
        <Route exact path="/login" render={(props) => <Login {...props} />}/>
        <Route exact path="/register" render={(props) => <Register {...props} />}/>
        <Route exact path="/submit" render={(props) => <StorySubmit {...props}/>}/>
        <Route exact path="/story" render={(props) => <StoryView {...props}/>}/>
        <Route exact path="/me" render={(props) => <MyAccount {...props}/>}/>
        <Route exat path="/story/:story_id/edit" render={(props) => <StoryEdit {...props}/>}/>
        <Route path="/story/:story_id" render={(props) => <Story {...props}/>}/>
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
