import React from "react"
import {
    Link,
    Redirect,
  } from "react-router-dom";
import { Menu, Transition, Switch } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/solid'
import { SearchIcon } from "@heroicons/react/outline";
import Cookies from "js-cookie";

export default class NavBar extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            user: Cookies.get('user'),
            token: Cookies.get('token'),
            darkMode: false,
            searchValue: "",
            search: false ,
            searchBar: (this.props.searchBar != null ?  false : true),
            isShowing: false,
        }
        this.url = "http://127.0.0.1:8000/" 
        this.handleLogout = this.handleLogout.bind(this);
        this.setDarkMode = this.setDarkMode.bind(this);
        this.handleSearch = this.handleSearch.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    setDarkMode(){
        if (this.state.darkMode){
            this.setState({
                darkMode: false
            })
        }
        else{
            this.setState({
                darkMode: true
            })
        }       
    }

    handleChange(event){
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });

    }
    
    handleSearch(){
        this.setState({
            search: true,
        })
    }

    handleLogout(){
        fetch(this.url+"auth/logout/",
        {
            method: 'POST',
            mode: 'cors', 
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + this.props.token,
            },
        })
        .then(this.setState({
            user: null,
            token: null,
        }))
        .then(Cookies.remove('user'))
        .then(Cookies.remove('token'))

    }

    /* 
    ***FIX***
    Navbar rendering below other components - FIXED
    */

    render() {
        const isLoggedIn = (this.state.token != null) ? true : false
        if (this.state.search){
            return <Redirect to={{
                pathname: "/search",
                state: { token: this.state.token, user: this.state.user, search: this.state.searchValue}
              }} />
        }
        else{
            return(
                <div className="bg-white">
                    <div class="relative flex justify-center mt-4 pb-4">
                    <Link to={{pathname: "/"}} class="absolute left-48 font-medium rounded-md px-2 pb-2 text-lg hover:text-purple-700">
                        <p class="text-3xl font-bold">LITSUB</p>
                    </Link>
                        <div class=" mt-1">
                        <Link to={{pathname: "/story"}} class="m-12 text-lg hover:text-gray-600">Stories</Link>
                        <Link to={{pathname: "/authors"}} class="m-12 text-lg hover:text-gray-600">Authors</Link>
                        <Link to={{pathname: "/tags"}} class="m-12 text-lg hover:text-gray-600">Tags</Link>
                        </div>

                        {this.state.searchBar ?
                        (
                        <div onMouseOver={() => this.setState({isShowing:true})} className="group absolute right-72 pt-2">
                            <form onSubmit={this.handleSearch} className="">
                            <div className="group flex">
                            <button onClick={this.handleSearch} type="submit"><SearchIcon className="h-5 w-5"/></button>
                            <Transition show={this.state.isShowing}                                     
                                    enter="transition ease-out duration-300"
                                    enterFrom="transform opacity-0 scale-95"
                                    enterTo="transform opacity-100 scale-100"
                                    leave="transition ease-in duration-75"
                                    leaveFrom="transform opacity-100 scale-100"
                                    leaveTo="transform opacity-0 scale-95" 
                                    className="font-bold">
                            <input onBlur={() => this.setState({isShowing:false})} autoFocus className="ml-4 border-b-2 drop-shadow-md border-black-700 focus:outline-none focus:block w-60" name="searchValue" type="text" value={this.state.searchValue} onChange={this.handleChange} />
                            </Transition>
                            </div>
                            </form>
                        </div>
                        ):(
                        <div/>
                        )
                        }

                        <div>
                        {isLoggedIn ? (
                            <div className="absolute right-48 h-16 w-16">
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
                                <Menu.Items class="w-32 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    <Menu.Item>
                                        {({active}) => (
                                        <Link to={{pathname:"/me"}} 
                                            class={`${ active ? "bg-purple-700 text-white": "text-gray-900"} group flex rounded-md items-center w-full px-2 py-2 text-sm`}>
                                                My Account
                                        </Link>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({active}) => (
                                        <Link to={{pathname:"/"}} onClick={this.handleLogout} 
                                            class={`${ active ? "bg-purple-700 text-white": "text-gray-900"} group flex rounded-md items-center w-full px-2 py-2 text-sm`}> 
                                                Logout
                                        </Link>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({active}) => (
                                        <Link to={{pathname: "/submit"}} 
                                            class={`${ active ? "bg-purple-700 text-white": "text-gray-900"} group flex rounded-md items-center w-full px-2 py-2 text-sm`}>
                                                Submit
                                        </Link>
                                        )}
                                    </Menu.Item>
                                </Menu.Items>
                                </Transition>
                            </Menu>
                            </div>
                        ) : (
                            <div className="absolute right-48 top-1">
                            <Link to="/login" class="h-16 w-16 bg-purple-700 pb-2 pt-1 px-4 rounded-full text-white hover:bg-purple-600 hover:text-black">Login</Link>
                            </div>
                        )
                        }
                        </div>
                    </div>
                    <div className="absolute right-10 top-4">
                    <Switch
                        checked={this.state.darkMode}
                        onChange={this.setDarkMode}
                        className={`${
                            this.state.darkMode ? 'bg-white' : 'bg-black'
                        } relative inline-flex items-center h-8 rounded-full w-14`}
                        >
                        <span className="sr-only">Enable notifications</span>
                        <span
                            className={`${
                            this.state.darkMode ? 'translate-x-8 bg-black' : 'translate-x-1 bg-white'
                            } inline-block w-5 h-5 transform rounded-full`}
                        />
                    </Switch>
                    </div>
                </div>
            )
        }
    }
}
