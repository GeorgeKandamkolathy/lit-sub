import React from 'react';
import NavBar from "../common/nav-bar";
import { ThumbUpIcon as ThumbUpIconOutline } from '@heroicons/react/outline';

export default class StoryEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            user: this.props.user,
            isLoaded: false,
            story_id: this.props.story_id,
            story: this.props.story,
            comments: [],
            comment_text: "",
            token: this.props.token,
            tags: this.props.tags,
        };
        this.url = "http://127.0.0.1:8000/" 
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event){
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        fetch(this.url + 'story/'+ this.state.story_id + "/",{
            method: 'POST',
            mode: 'cors', 
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + this.state.token,
            },
            body: JSON.stringify({comment_text:this.state.comment_text})
        })
        .then(data => data.json())
        .then((result) => {
            this.setState({
            })},
            (error) => {
                this.setState({
                    error: error,
                })
            }
            )        
    }

    componentDidMount(){
        fetch(this.url + "story/comments/"+this.state.story_id +"/0")
        .then(res => res.json())
        .then((result) => {
            this.setState({
                isLoaded: true,
                comments: result
            })
        })
    }


    render(){
        const {story, error, token, user} = this.state 
        console.log(this.props)
        console.log(story)
        if (error) {
            return <div>Error: {error.message}</div>;
        }
        else{
            return(
                <div>
                    <NavBar user={user} token={token}/>
                    <div class="flex flex-col bg-purple-50 h-auto">
                        <div class="flex justify-center h-screen pb-26 mb-4">
                        <div class="bg-white w-3/4 h-auto mt-14 rounded-lg ">
                        <h1 class="text-center mt-10 text-5xl font-medium">{story.story_title}</h1>
                        <h3 class="text-center mt-5">{story.author_name}</h3>
                        <p class="px-20 mt-10">{story.story_text}</p>
                        </div>
                        </div>
                        
                        <div class="flex">
                        <p class="ml-72 mb-5">{this.state.comments.length} comments</p>
                        <ThumbUpIconOutline className="h-5 w-5"/>
                        </div>
                        <form onSubmit={this.handleSubmit} class="flex justify-center mb-5">
                            <textarea class="resize-none w-6/12 rounded border-2 border-black-400 focus:outline-none focus:ring-2 focus:border-purple-300" rows="1" cols="30" name="comment_text" value={this.state.comment_text} onChange={this.handleChange}/>
                            <input type="submit" value="Comment" class="rounded py-1 px-1 bg-purple-700 text-white hover:bg-purple-400 hover:text-black cursor-pointer"/>
                        </form>
                        {this.state.comments.length !== 0 ? (
                        <ul>
                        {this.state.comments.map(comment => (
                            <div class="flex justify-center mt-1">
                            <li key={story.id} class="group w-1/2">
                            <div class="flex mb-4 bg-white rounded drop-shadow">
                                <div class="flex flex-col ml-5 p-4 max-w-xs">
                                <p>{comment.comment_text}</p>
                                <div class="flex ml-2">
                                <p class="ml-1">{comment.author_name}</p>
                                </div>
                                </div>
                            </div>
                            </li>  
                            </div>
                        ))}
                        </ul>
                        ) :(
                        <div className="flex justify-center">
                        <div class="text-center mb-20 bg-white w-6/12">
                        <div class="flex flex-col ml-5 p-4 max-w-xs">
                                <div class="flex ml-2">
                                <p class="ml-1">Be the first person to comment</p>
                                </div>
                                </div>
                        </div>
                        </div>
                        )
                        }

                    </div>
                    <div class="bg-gray-50 h-40 w-full">
                    </div>
                </div>
            );
        }   
    }
}