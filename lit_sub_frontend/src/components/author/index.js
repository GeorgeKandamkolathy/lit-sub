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
                <div class="flex">
                    <img src={profile}/>
                    <div class="ml-10">
                        <h3 class="text-8xl">{this.state.username}</h3>
                        <p class="mt-10">Join date</p>
                    </div>
                </div>
                    <p>{this.state.bio}</p>
                <ul>
                    {this.state.stories.map(story => (
                        <li key={story.id}>
                            <div class="flex flex-col w-96">
                                <div class="text-2xl font-bold hover:text-gray-600">
                                    <Link to={{ pathname: "/story/" + story.id,
                                        state: {token: this.state.token, user: this.state.user}}}>
                                    {story.story_title}
                                    </Link>
                                </div>
                                <div class="text-base">{story.synopsis}</div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }

}