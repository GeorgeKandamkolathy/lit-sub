import React from 'react';
import { Redirect, Link } from 'react-router-dom';
import {XIcon} from '@heroicons/react/solid'

export default class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            user: null,
            token: "",
            usernameValue: "",
            passwordValue: "",
            emailValue: "",
            registerError: [],
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
        fetch(this.url + 'auth/registration/',{
            method: 'POST',
            mode: 'cors', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({username:this.state.usernameValue, email:this.state.emailValue, password1:this.state.password1Value, password2:this.state.password2Value})
        })
        .then(data => data.json())
        .then((result) => {
            this.setState({
                registerError: result,
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
        const {registerError} = this.state
        const fail = this.state.token == undefined;
        console.log(registerError)
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
                <div class="flex">
                    <div class="flex flex-col items-center justify-center h-3/4 w-1/2">
                        <h2 class="ml-10 mb-7 text-3xl text-purple-600 font-bold">LITSUB</h2>
                        <ul>
                            <li>Get access to Hundreds of authors and Thousands of works</li>
                            <li>Support your favourite authors</li>
                        </ul>
                    </div>
                    <div class="flex justify-end mr-36 items-center h-screen mt-10">
                    <form onSubmit={this.handleSubmit} class="drop-shadow">
                        <div class="inline-flex flex-col shadow-lg px-20 pb-24 pt-10">
                        <h3 class="text-3xl mb-10 font-bold">Create Account</h3>
                        <label class="my-7">
                        <p>Email:</p>
                        <input class="rounded border-2 border-black-400 focus:outline-none focus:ring-2 focus:border-purple-300 pl-3 w-96 py-2" name="emailValue" type="text" value={this.state.emailValue} onChange={this.handleChange} />
                        {"email" in registerError ? <p>{registerError['email'][0]}</p> : <div/>}
                        </label>
                        <label class="my-7">
                        <p>Username:</p>
                        <input class="rounded border-2 border-black-400 focus:outline-none focus:ring-2 focus:border-purple-300 pl-3 w-96 py-2" name="usernameValue" type="text" value={this.state.usernameValue} onChange={this.handleChange} />
                        {"username" in registerError ? <p>{registerError['username'][0]}</p> : <div/>}
                        </label>
                        <label class="my-7">
                        <p>Password:</p>
                        <input class="rounded border-2 border-black-400 focus:outline-none focus:ring-2 focus:border-purple-300 pl-3 w-96 py-2" name="password1Value" type="password" value={this.state.password1Value} onChange={this.handleChange} />
                        {"password1" in registerError ? <p>{registerError['password1'][0]}</p> : <div/>}
                        </label>
                        <label class="my-7">
                        <p>Confirm Password:</p>
                        <input class="rounded border-2 border-black-400 focus:outline-none focus:ring-2 focus:border-purple-300 pl-3 w-96 py-2" name="password2Value" type="password" value={this.state.password2Value} onChange={this.handleChange} />
                        {"non_field_errors" in registerError ? <p>{registerError['non_field_errors'][0]}</p> : <div/>}
                        </label>
                        <input type="submit" value="Create Account" class="rounded mt-5 py-1 bg-purple-700 text-white hover:bg-purple-400 hover:text-black cursor-pointer"/>
                        </div>
                        <p>Already have an account?</p> <Link to="/login" className="text-purple-700 hover:underline">Login</Link>
                    </form>
                    </div>
                </div>
                <div className="h-20 w-full">

                </div>
                </div>
            );
        }
    }
}