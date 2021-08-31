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
            user: this.props.user,
            token: this.props.token,
        }
    }
    
    render() {
        const isLoggedIn = (this.props.token != null) ? true : false
        return(
                <div class="relative flex justify-center ">
                    <div class="">
                    <Link to="/" class="m-8">Home</Link>
                    <Link to="/story" class="m-16">Stories</Link>
                    <Link to="/authors" class="m-8">Authors</Link>
                    </div>
                    <div class="absolute right-10 h-16 w-16">
                    {isLoggedIn ? (
                        <Link to="/logout">Logout</Link>    
                    ) : (
                        <Link to="/login">Login</Link>
                    )
                    }
                    </div>
                </div>
        )
    }

}
