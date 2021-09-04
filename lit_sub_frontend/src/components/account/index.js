import React from 'react';
import {Link} from 'react-router-dom'
import NavBar from '../common/nav-bar';
import profile from '../../local/profile.png'

export default class MyAccount extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            user: (this.props.location.state == undefined ? null : this.props.location.state.user),
            bio: null,
            stories:[],
            token: (this.props.location.state == undefined ? null : this.props.location.state.token),
        };
        this.url = "http://127.0.0.1:8000/" 
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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
        fetch(this.url+'author/me/', {
            method: 'POST',
            mode: 'cors', 
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + this.state.token
            },
            body: JSON.stringify({bio:this.state.bio})            
        })
        .then(res => res.json())
        .then(
            (error)=>{
                this.setState({
                    error
                })
            }
        )
    }

    componentDidMount(){
        fetch(this.url + "author/me/", {
            method:"GET",
            mode: 'cors', 
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + this.state.token,
            },
        })
        .then(res => res.json())
        .then(
            (result) => this.setState({
                isLoaded: true,
                bio: result.bio,
                stories: result.story_set,
            }),
            (error) => ({
                isLoaded: true,
                error
            })
        )
    }

    render(){
        const {user, token, stories, error} = this.state;
        console.log(this.state.token);
        return(
            <div>
                <NavBar user={user} token={token}/>
                <div class="flex">
                    <img src={profile}/>
                    <div class="ml-10">
                        <h3 class="text-8xl">{user}</h3>
                        <p class="mt-10">Join date</p>
                        <form onSubmit={this.handleSubmit} class="mt-5">
                        <p>Bio</p>
                        <textarea class="resize-none rounded border-2 border-black-400 focus:outline-none focus:ring-2 focus:border-purple-300" rows="5" cols="100" name="bio" value={this.state.bio} onChange={this.handleChange}/>
                        <input type="submit" value="Submit" class="rounded py-1 bg-purple-700 text-white hover:bg-purple-400 hover:text-black cursor-pointer"/>
                         </form>
                    </div>
                </div>
                <ul>
                </ul>
            </div>
        );
    }

}