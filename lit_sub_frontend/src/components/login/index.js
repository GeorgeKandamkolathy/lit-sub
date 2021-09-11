import React from 'react';
import { Redirect, Link } from 'react-router-dom';
import {XIcon} from '@heroicons/react/solid'

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            user: null,
            token: "",
            usernameValue: "",
            passwordValue: "",
        };
        this.url = "http://127.0.0.1:8000/" 
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleChange(event){
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    handleSubmit(event){
        event.preventDefault();
        fetch(this.url + 'auth/login/',{
            method: 'POST',
            mode: 'cors', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({username:this.state.usernameValue, password:this.state.passwordValue})
        })
        .then(data => data.json())
        .then((result) => {
            this.setState({
                token: result.key,
                user: this.state.usernameValue,
            })},
            (error) => {
                this.setState({
                    error: error,
                })
            }
            )
    }

    render() {
        const fail = this.state.token == undefined;
        if (this.state.error){
            return <div>Error: {this.state.error.message}</div>;
        }
        else if (this.state.token !== "" && this.state.token !== undefined){
            return(
                <Redirect to={{
                    pathname: "/",
                    state: { token: this.state.token, user: this.state.user}
                  }} />
            );
        }
        else{
            return(
                <div>
                    {fail ? (
                        <div class="bg-purple-700">
                            <div class="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
                                <p class="text-white text-base text-center">Unrecognized Login</p>
                                <XIcon class="absolute top-3 right-5 h-6 w-6 text-white"/>
                            </div>
                        </div> 
                    ) :(
                        <div></div>
                    )
                    }

                    <div class="flex justify-center items-center h-screen">
                    <form onSubmit={this.handleSubmit} class="drop-shadow">
                        <h2 class="ml-10 mb-7 text-3xl text-purple-600 font-bold">LITSUB</h2>
                        <div class="inline-flex flex-col shadow-lg px-20 pb-24 pt-10">
                        <h3 class="text-3xl mb-10 font-bold">Sign in</h3>
                        <label class="">
                        <p>Username:</p>
                        <input class="rounded border-2 border-black-400 focus:outline-none focus:ring-2 focus:border-purple-300 pl-3 w-96 py-2" name="usernameValue" type="text" value={this.state.usernameValue} onChange={this.handleChange} />
                        </label>
                        <label class="my-14">
                        <p>Password:</p>
                        <input class="rounded border-2 border-black-400 focus:outline-none focus:ring-2 focus:border-purple-300 pl-3 w-96 py-2" name="passwordValue" type="password" value={this.state.passwordValue} onChange={this.handleChange} />
                        </label>
                        <input type="submit" value="Sign in" class="rounded py-1 bg-purple-700 text-white hover:bg-purple-400 hover:text-black cursor-pointer"/>
                        </div>
                        <p>Don't have an account?</p> <Link to="/register" className="text-purple-700 hover:underline">Register</Link>
                    </form>
                    </div>
                </div>
            );
        }
    }
}