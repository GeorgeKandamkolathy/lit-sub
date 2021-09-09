import React from 'react';
import {Link} from 'react-router-dom'
import NavBar from '../common/nav-bar';
import profile from '../../local/profile.png'
import Item from '../common/item';
import { ThumbUpIcon, TrashIcon } from '@heroicons/react/solid';

export default class MyAccount extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            user: (this.props.location.state == undefined ? null : this.props.location.state.user),
            bio: null,
            stories_set:[],
            stories:[],
            token: (this.props.location.state == undefined ? null : this.props.location.state.token),
        };
        this.url = "http://127.0.0.1:8000/" 
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onDelete = this.onDelete.bind(this);
    }

    onDelete(event){
        fetch(this.url+'story/' + event.target.id+ '/',{
            method: "DELETE",
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + this.state.token
            },
        })
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
                stories_set: result.story_set,
            }, () => {
                fetch(this.url + "story/group/story", {
                    method: "POST",
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ids:this.state.stories_set.toString()})
                })
                .then(res => res.json())
                .then(
                    (result) => {this.setState({
                        stories: result.results
                    })
                    }
                )
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
                <h3 className="text-3xl text-center mb-3 underline">Stories</h3>
                <ul>
                {this.state.stories.map(story => (
                    <div className="flex justify-center">
                    <li key={story.id} className="group w-1/2">
                        <Item>
                            <div className="flex flex-col ml-5 p-4 max-w-xs">
                            <Link className="font-medium text-xl" 
                                to={{ pathname: "/story/" + story.id,
                                    state: {token: this.state.token, user: this.state.user}}}>
                            {story.story_title}
                            </Link>
                            <div className="flex ml-2">
                            <ThumbUpIcon className="w-4 h-4 mt-1 ml-4" />
                            <p className="ml-1">{story.likes}</p>
                            </div>
                            </div>
                            <p className="mt-10 italic">{story.synopsis}</p>
                        </Item>
                    </li>  
                    <button onClick={this.onDelete} id={story.id} className="rounded py-1 bg-purple-700 h-28 text-white hover:bg-purple-400 hover:text-black cursor-pointer">
                        <TrashIcon className="h-5 w-16"/>
                    </button>
                    </div>
                ))}
                </ul>
                <ul>
                </ul>
            </div>
        );
    }

}