import React from 'react';
import {Link} from 'react-router-dom'
import NavBar from '../common/nav-bar';

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            user: null,
            authors: [],
            stories: [],
            token: (this.props.location.state == undefined ? null : this.props.location.state.token),
        };
        this.url = "http://127.0.0.1:8000/" 
    }


    
    componentDidMount() {
        if (this.state.token != null){
            fetch(this.url + 'author/me')
                .then(res => res.json())
                .then(
                    (result) => {
                        this.setState({
                            isLoaded: true,
                            user: result.user
                        });
                    }
                )
        }
        fetch(this.url + "story/")
        .then(res => res.json())
        .then(
            (result) => {
                this.setState({
                    isLoaded: true,
                    stories: result
                });
            },
            (error) => {
                this.setState({
                  isLoaded: true,
                  error
                });
            }
        )
        fetch(this.url + "author/")
        .then(res => res.json())
        .then(
            (result) => {
                this.setState({
                    isLoaded: true,
                    authors: result
                });
            },
            (error) => {
                this.setState({
                  isLoaded: true,
                  error
                });
            }
        )
    }

    render() {
        const {error, isLoaded, user, authors, token, stories} = this.state;
        console.log(token)
        if (error) {
            return <div>Error: {error.message}</div>;
        }
        else{
            return(
                <div class= "h-full">
                    <div class = "mt-4">
                        <NavBar user={user} token={token}/>
                    </div>
                    <h1 class="m-10 text-5xl font-bold">LITSUB</h1>
                    <div class="bg-purple-600 bg-opacity-25">
                        <div class="relative flex flex-row h-72 pl-10 gap-20">
                        <div>
                        <h3 class="text-purple-600 font-bold text-4xl w-12 mt-24 mr-8">Top Stories</h3>
                        </div>
                            <ul>
                            <div class="grid grid-cols-3 gap-x-4 gap-y-14 mt-6" >
                            {stories.map(story => (
                            <li key={story.id}>
                                <div class="flex flex-col w-96">
                                    <div class="text-2xl font-bold"><Link to="/story/">{story.story_title}</Link></div>
                                    <div class="text-base">{story.synopsis}</div>
                                    <div class="text-base italic"><Link to="/author/">{story.author_name}</Link></div>
                                </div>
                            </li>
                            ))}
                            </div>
                            </ul>   
                            </div>
                    </div>
                    <div class="bg-blue-600 bg-opacity-25 mt-10 py-5">
                        <h3 class="text-blue-600 font-bold text-4xl py-20 w-10 pl-10">Popular Authors</h3>
                        <ul>
                            {authors.map(author => (
                            <li key={author.id}>
                                <div>
                                {author.author_name}
                                {author.bio}
                                </div>
                            </li>
                            ))}
                        </ul>                     
                    </div>
                </div>
            );
        }
    }

}

