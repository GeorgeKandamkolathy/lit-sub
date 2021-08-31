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
            <div>
                <div class="relative flex justify-center mt-4 pb-3">
                <p class="absolute left-48 text-xl font-bold">LITSUB</p>
                    <div class="">
                    <Link to="/" class="m-8 font-medium hover:text-gray-600">Home</Link>
                    <Link to="/story" class="m-16 hover:text-gray-600">Stories</Link>
                    <Link to="/authors" class="m-8 hover:text-gray-600">Authors</Link>
                    </div>
                    <div class="absolute right-48 h-16 w-16">
                    {isLoggedIn ? (
                        <Link to="/logout" class="bg-purple-700 pb-2 pt-1 px-4 rounded-full text-white hover:bg-purple-500 hover:text-black">Logout</Link>    
                    ) : (
                        <Link to="/login" class="bg-purple-700 pb-2 pt-1 px-4 rounded-full text-white hover:bg-purple-500 hover:text-black">Login</Link>
                    )
                    }
                    </div>
                </div>
            </div>
        )
    }

}
