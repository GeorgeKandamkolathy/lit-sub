import React from 'react';
import {Link} from 'react-router-dom'
import NavBar from '../common/nav-bar';
import profile from '../../local/profile.png'

export default class Author extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            user: (this.props.location.state == undefined ? null : this.props.location.state.user),
            bio: null,
            username: "",
            stories:[],
            author_id: this.props.match.params.author_id,
            token: (this.props.location.state == undefined ? null : this.props.location.state.token),
        };
        this.url = "http://127.0.0.1:8000/" 
    }

    componentDidMount(){
        fetch(this.url + "author/" + this.state.author_id + "/")
        .then(res => res.json())
        .then(
            (result) => this.setState({
                isLoaded: true,
                username: result.username,
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
                        <h3 class="text-8xl">{this.state.username}</h3>
                        <p class="mt-10">Join date</p>
                    </div>
                </div>
                    <p>{this.state.bio}</p>
                <ul>
                </ul>
            </div>
        );
    }

}