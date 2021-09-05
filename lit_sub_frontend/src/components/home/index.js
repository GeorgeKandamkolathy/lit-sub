import React from 'react';
import {Link} from 'react-router-dom'
import NavBar from '../common/nav-bar';
import { ArrowRightIcon } from '@heroicons/react/solid';

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            user: (this.props.location.state == undefined ? null : this.props.location.state.user),
            authors: [],
            stories: [],
            token: (this.props.location.state == undefined ? null : this.props.location.state.token),
            prev_story_page: null,
            next_story_page: "http://127.0.0.1:8000/story/",
            prev_author_page: null,
            next_author_page: "http://127.0.0.1:8000/author/",
            
        };
        this.url = "http://127.0.0.1:8000/" 
        this.onClick = this.onClick.bind(this)
    }

    onClick(event){
        const target = event.target;
        const name = target.name;

        if (name == "story"){
            fetch(this.state.story_page)
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        stories: result.results,
                        next_story_page: result.next,
                        prev_story_page: result.previous,
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
        else if (name == "author"){
            fetch(this.state.author_page)
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        authors: result,
                        next_author_page: result.results,
                        prev_author_page: result.previous,
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
    }

    componentDidMount() {
        fetch(this.state.story_page)
        .then(res => res.json())
        .then(
            (result) => {
                this.setState({
                    isLoaded: true,
                    stories: result.results,
                    next_story_page: result.next,
                    prev_story_page: result.previous,
                });
            },
            (error) => {
                this.setState({
                  isLoaded: true,
                  error
                });
            }
        )
        fetch(this.state.author_page)
        .then(res => res.json())
        .then(
            (result) => {
                this.setState({
                    isLoaded: true,
                    authors: result,
                    next_author_page: result.results,
                    prev_author_page: result.previous,
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
        if (this.state.error) {
            return <div>Error: {this.state.error.message}</div>;
        }
        else{
            return(
                <div class= "h-full">
                    <NavBar user={this.state.user} token={this.state.token}/>
                    <h1 class="mb-20 ml-14 mt-4 text-5xl font-bold">LITSUB</h1>
                    <div class="bg-purple-600 bg-opacity-25 shadow-lg">
                        <div class="relative flex flex-row h-72 pl-10 gap-20">
                            <div>
                            <h3 class="text-purple-600 font-bold text-4xl w-12 mt-24 mr-8">Top Stories</h3>
                            </div>
                            <ul>
                            <div class="grid grid-cols-3 gap-x-4 gap-y-14 mt-6" >
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
                                    <div class="text-base italic"><Link to="/author/">{story.author_name}</Link></div>
                                </div>
                            </li>
                            ))}
                            </div>
                            </ul>   
                            <button onClick={this.onClick}>
                                <ArrowRightIcon class="transform h-5 w-5 hover:scale-150 hover:text-blue-700"/>
                            </button>
                        </div>
                    </div>
                    <div class="bg-blue-600 bg-opacity-25 mt-16 shadow-lg">
                        <div class="relative flex flex-row h-72 pl-10 gap-20">
                        <div>
                        <h3 class="text-blue-600 font-bold text-4xl w-12 mt-24 mr-8">Popular Authors</h3>
                        </div>
                            <ul>
                            <div class="grid grid-cols-3 gap-x-4 gap-y-14 mt-6" >
                            {this.state.authors.map(author => (
                            <li key={author.id}>
                                <div class="flex flex-col w-96">
                                    <div class="text-2xl font-bold"><Link to={"/author/"+ author.id}>{author.username}</Link></div>
                                    <div class="text-base italic">{author.bio}</div>
                                </div>
                            </li>
                            ))}
                            </div>
                            </ul>   
                            <button onClick={this.onClick}>
                                <ArrowRightIcon class="transform h-5 w-5 hover:scale-150 hover:text-blue-700"/>
                            </button>
                            </div>
                    </div>    

                    <div class="bg-gray-100 h-40 mt-20">

                    </div>
                </div>
            );
        }
    }

}

