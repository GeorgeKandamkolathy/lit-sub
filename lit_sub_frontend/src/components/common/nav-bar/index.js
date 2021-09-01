import React from "react"
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useLocation,
  } from "react-router-dom";
import { Listbox, Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/solid'

export default class NavBar extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            user:this.props.user,
            token:this.props.token,
        }
        this.url = "http://127.0.0.1:8000/" 
        this.handleLogout = this.handleLogout.bind(this)
    }
    
    handleLogout(){
        fetch(this.url+"auth/logout/",
        {
            method: 'POST',
            mode: 'cors', 
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token' + this.props.token,
            },
        })
        .then(this.setState({
            user: null,
            token: null,
        }))

    }

    render() {
        const isLoggedIn = (this.state.token != null) ? true : false
        return(
            <div>
                <div class="relative flex justify-center mt-4 pb-6">
                <p class="absolute left-48 text-xl font-bold">LITSUB</p>
                    <div class="">
                    <Link to={{pathname: "/", state: { token: this.state.token, user: this.state.user}}} class="m-8 font-medium hover:text-gray-600">Home</Link>
                    <Link to="/story" class="m-16 hover:text-gray-600">Stories</Link>
                    <Link to="/authors" class="m-8 hover:text-gray-600">Authors</Link>
                    </div>
                    <div class="absolute right-48 h-16 w-16">
                    {isLoggedIn ? (
                        <Menu>
                            <Menu.Button class="inline-flex justify-center bg-purple-700 pb-2 pt-1 px-4 rounded-full text-white hover:bg-purple-500 hover:text-black">
                                {this.state.user}
                                <ChevronDownIcon
                                className="w-5 h-5 ml-2 mt-1 -mr-1 text-violet-200 hover:text-violet-100"
                                aria-hidden="true"
                                />
                            </Menu.Button>
                            <Transition
                                  as={React.Fragment}
                                  enter="transition ease-out duration-100"
                                  enterFrom="transform opacity-0 scale-95"
                                  enterTo="transform opacity-100 scale-100"
                                  leave="transition ease-in duration-75"
                                  leaveFrom="transform opacity-100 scale-100"
                                  leaveTo="transform opacity-0 scale-95"
                            >
                            <Menu.Items class="absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <Menu.Item>
                                    {({active}) => (
                                    <Link to="/me" class={`${ active ? "bg-purple-700 text-white": "text-gray-900"} group flex rounded-md items-center w-full px-2 py-2 text-sm`}> My Account</Link>
                                    )}
                                </Menu.Item>
                                <Menu.Item>
                                    {({active}) => (
                                    <Link to={{pathname:"/", state: {token: null, user: null}}} onClick={this.handleLogout} class={`${ active ? "bg-purple-700 text-white": "text-gray-900"} group flex rounded-md items-center w-full px-2 py-2 text-sm`}> Logout</Link>
                                    )}
                                    </Menu.Item>
                            </Menu.Items>
                            </Transition>
                        </Menu>
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
