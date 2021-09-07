import React from 'react';
import {Link} from 'react-router-dom'
import NavBar from '../common/nav-bar';
import profile from '../../local/profile.png'
import Item from '../common/item';
import { ThumbUpIcon } from '@heroicons/react/outline';

export default class Author extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            user: (this.props.location.state == undefined ? null : this.props.location.state.user),
            bio: null,
            username: "",
            stories_set:[],
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
                stories_set: result.story_set,
            }, () => {
                fetch(this.url + "story/group/story",{
                    method:"POST",
                    mode: 'cors', 
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ids:this.state.stories_set.toString()})
                })
                .then(res => res.json())
                .then(
                    (results) => this.setState({ 
                        isLoaded: true,
                        stories: results.results
                    })
                )
            }),
            (error) => this.setState({
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
                <div className="flex">
                    <img src={profile}/>
                    <div className="ml-10">
                        <h3 className="text-8xl">{this.state.username}</h3>
                        <p className="mt-10">Join date</p>
                    </div>
                </div>
                    <p>{this.state.bio}</p>
                
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
                            <Link className="font-bold ml-4 w-auto" to={"author/"+story.author}>{story.author_name}</Link>
                            <ThumbUpIcon className="w-4 h-4 mt-1 ml-4" />
                            <p className="ml-1">{story.likes}</p>
                            </div>
                            </div>
                            <p className="mt-10 italic">{story.synopsis}</p>
                        </Item>
                    </li>  
                    </div>
                ))}
                </ul>
            </div>
        );
    }

}