import React from "react"
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";

export default class NavBar extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            user: props.user,
            token: props.token,
        }
    }
    
    render() {
        const isLoggedIn = (props.user != null) ? true : false
        return(
            <Router>
                <div>
                    <nav>
                    <Link to="/">Home</Link>
                    <Link to="/story">Stories</Link>
                    <Link to="/authors">Authors</Link>
                    {isLoggedIn ? (
                        <Link to="/logout">Logout</Link>    
                    ) : (
                        <Link to="/login">Login</Link>
                    )
                    }
                    </nav>
                </div>

                <Switch>
                    <Route path="/story">
                        <Story />
                    </Route>
                    <Route path="/authors">
                        <Authors />
                    </Route>
                    <Route path="/logout">
                        <Logout />
                    </Route>
                    <Route path="/login">
                        <Login />
                    </Route>
                    <Route path="/">
                        <Home />
                    </Route>
                </Switch>
            </Router>
        )
    }

}
