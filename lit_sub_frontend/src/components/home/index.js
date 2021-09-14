import React from 'react';
import {Link} from 'react-router-dom'
import NavBar from '../common/nav-bar';
import { ArrowRightIcon, ArrowLeftIcon } from '@heroicons/react/solid';

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            user: (this.props.location.state == undefined ? null : this.props.location.state.user),
            authors: [],
            stories: [],
            tags: [],
            token: (this.props.location.state == undefined ? null : this.props.location.state.token),
            prev_story_page: null,
            next_story_page: "http://127.0.0.1:8000/story/sort/top/?limit=12&offset=0",
            story_offset: 0,
            prev_author_page: null,
            next_author_page: "http://127.0.0.1:8000/author/?limit=24&offset=0",
            author_offset: 0,
        };
        this.url = "http://127.0.0.1:8000/" 
        this.onClick = this.onClick.bind(this)
    }

    onClick(event){
        const name = event.currentTarget.id;
        console.log(name)
        if (name == "story_next" && this.state.stories.slice(this.state.story_offset + 6, this.state.story_offset + 12).length != 0){
            this.setState({
                story_offset: this.state.story_offset + 6
            })
        }
        else if (name == "story_prev"){
            this.setState({
                story_offset: this.state.story_offset - 6 
            })
        }

        else if (name == "author_next"&& this.state.authors.slice(this.state.author_offset + 12, this.state.author_offset + 24).length != 0){
            this.setState({
                author_offset: this.state.author_offset + 12
            })
        }
        else if (name == "author_prev"){
            this.setState({
                author_offset: this.state.author_offset - 12 
            })
        }

        /*
        if (name == "story_next" && this.state.next_story_page != null){
            fetch(this.state.next_story_page)
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
        if (name == "story_prev" && this.state.prev_story_page != null){
            fetch(this.state.prev_story_page)
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
        else if (name == "author" && this.state.next_author_page != null){
            fetch(this.state.next_author_page)
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        authors: result.results,
                        next_author_page: result.next,
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
        */
    }

    componentDidMount() {
        fetch(this.state.next_story_page)
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
        fetch(this.state.next_author_page)
        .then(res => res.json())
        .then(
            (result) => {
                this.setState({
                    isLoaded: true,
                    authors: result.results,
                    next_author_page: result.next,
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
        fetch(this.url + 'tag/')
        .then(res => res.json())
        .then(
            (result) => {
                this.setState({
                    isLoaded: true,
                    tags: result,
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
                        <div class="relative flex flex-row min-h-72 h-auto pb-3 pl-10 gap-20">
                            <div>
                            <h3 class="text-purple-600 font-bold text-4xl w-12 mt-24 mr-5">Top Stories</h3>
                            </div>
                            {this.state.story_offset != 0 ?
                            (
                            <div id="story_prev" className="flex flex-col justify-center">
                            <ArrowLeftIcon id="story_prev" onClick={this.onClick} class="transform h-5 w-5 hover:scale-150 hover:text-blue-700 cursor-pointer"/>
                            </div>
                            ) : (
                                <div/>
                            )
                            }
                            <ul>
                            <div class="grid grid-cols-3 gap-x-4 mt-6 -ml-10" >
                            {this.state.stories.slice(this.state.story_offset, this.state.story_offset + 6).map(story => (
                            <li key={story.id} className="min-h-24">
                                <div class="flex flex-col w-96">
                                    <div class="text-2xl font-bold hover:text-gray-600">
                                        <Link to={{ pathname: "/story/" + story.id,
                                            state: {token: this.state.token, user: this.state.user}}}>
                                        {story.story_title}
                                        </Link>
                                    </div>
                                    <div class="text-base">{story.synopsis}</div>
                                    <div class="text-base italic"><Link to={{ pathname: "/author/" + story.author,
                                            state: {token: this.state.token, user: this.state.user}}}>{story.author_name}</Link></div>
                                </div>
                            </li>
                            ))}
                            </div>
                            </ul>   
                            <div id="story_next" className="flex flex-col justify-center -ml-5">
                            <ArrowRightIcon id="story_next" onClick={this.onClick} class="transform h-5 w-5 hover:scale-150 hover:text-blue-700 cursor-pointer -ml-10"/>
                            </div>
                        </div>
                    </div>
                    <div class="bg-blue-600 bg-opacity-25 mt-16 shadow-lg h-auto">
                        <div class="relative flex flex-row min-h-72 h-auto pb-3 pl-10 gap-20">
                        <div>
                        <h3 class="text-blue-600 font-bold text-4xl w-12 mt-24 mr-8">Popular Authors</h3>
                        </div>
                            {this.state.author_offset != 0 ?
                            (
                                <div id="author_prev" className="flex flex-col justify-center">
                                <ArrowLeftIcon id="author_prev" onClick={this.onClick} class="transform h-5 w-5 hover:scale-150 hover:text-blue-700 cursor-pointer"/>
                                </div>
                            ) : (
                                <div/>
                            )
                            }
                            <ul>
                            <div class="grid grid-cols-4 gap-x-4 gap-y-7 mt-6" >
                            {this.state.authors.slice(this.state.author_offset, this.state.author_offset + 12).map(author => (
                            <li key={author.id}>
                                <div class="flex flex-col w-70">
                                    <div class="text-2xl font-bold"><Link to={{ pathname: "/author/"+ author.id,
                                            state: {token: this.state.token, user: this.state.user}}}>{author.username}</Link></div>
                                    <div class="text-base italic">{author.bio}</div>
                                </div>
                            </li>
                            ))}
                            </div>
                            </ul>   
                            <div id="author_next" className="flex flex-col justify-center">
                            <ArrowRightIcon id="author_next" onClick={this.onClick} class="transform h-5 w-5 hover:scale-150 hover:text-blue-700 cursor-pointer -ml-20"/>
                            </div>
                            </div>
                    </div>    




                    <div class="bg-pink-600 bg-opacity-25 mt-16 shadow-lg h-auto">
                        <div class="relative flex flex-row min-h-72 h-auto pb-3 pl-10 gap-20">
                        <div>
                        <h3 class="text-pink-600 font-bold text-4xl w-12 mt-24 mr-8">Popular Authors</h3>
                        </div>
                            {this.state.author_offset != 0 ?
                            (
                                <div id="author_prev" className="flex flex-col justify-center">
                                <ArrowLeftIcon id="author_prev" onClick={this.onClick} class="transform h-5 w-5 hover:scale-150 hover:text-blue-700 cursor-pointer"/>
                                </div>
                            ) : (
                                <div/>
                            )
                            }
                            <ul>
                            <div class="grid grid-cols-4 gap-x-4 gap-y-7 mt-6" >
                            {this.state.tags.map(tag => (
                            <li key={tag.id}>
                                <div class="flex flex-col w-70">
                                    <div class="text-2xl font-bold"><Link to={{ pathname: "/author/"+ tag.id,
                                            state: {token: this.state.token, user: this.state.user}}}>{tag.tag_name}</Link></div>
                                </div>
                            </li>
                            ))}
                            </div>
                            </ul>   
                            <div id="author_next" className="flex flex-col justify-center">
                            <ArrowRightIcon id="author_next" onClick={this.onClick} class="transform h-5 w-5 hover:scale-150 hover:text-blue-700 cursor-pointer -ml-20"/>
                            </div>
                            </div>
                    </div>



                    <div class="bg-gray-100 h-40 mt-20">

                    </div>
                </div>
            );
        }
    }

}

