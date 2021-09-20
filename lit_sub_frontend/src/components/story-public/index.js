import React from 'react';
import { Link } from 'react-router-dom';
import NavBar from "../common/nav-bar";
import { AnnotationIcon, ThumbUpIcon as ThumbUpIconOutline, ChartBarIcon } from '@heroicons/react/outline';
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/solid';

export default class StoryPublic extends React.Component {
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
            fontSize: 2,
            tags:this.props.tags,
        };
        this.url = "http://127.0.0.1:8000/" 
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.onLike = this.onLike.bind(this);
        this.fontChange = this.fontChange.bind(this);
    }

    fontChange(event){
        const target = event.currentTarget;
        const value = target.value;
        console.log(this.state.fontSize)
        if (value === 'small' && this.state.fontSize > 0){
            this.setState({
                fontSize: this.state.fontSize - 1
        });}
        else if (value === 'large' && this.state.fontSize < 6){
            this.setState({
                fontSize: this.state.fontSize + 1
        });}
    }

    onLike(){
        fetch(this.url + "story/like/story/" + this.state.story_id + "/", {
            method: "PUT",
            mode: "cors",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + this.state.token,
            }
        })
        .then((res) => {
            if (res.status === 200){
                return res.json()
            }
            throw res
        })
        .then(
            (result) => {
                this.setState({
                    story: result
                })
            }
        )
        .catch((error) => {
            this.setState({ 
            })
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
        .then(
            (result) => {
                this.setState({
                    comments: this.state.comments.concat(result),
                    comment_text: "",
                })
            },
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
        let sizes = ['text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl']
        console.log(this.props)
        console.log(story.tags)
        if (error) {
            return <div>Error: {error.message}</div>;
        }
        else{
            return(
                <div>
                    <NavBar user={user} token={token}/>
                    <div className="flex flex-col bg-purple-50 h-auto">
                        <div className="flex justify-center h-screen pb-26 mb-4">
                        <div className="bg-white w-3/4 h-auto mt-14 rounded-lg mr-10">
                        <h1 className="text-center mt-10 text-5xl font-medium">{story.story_title}</h1>
                        <h3 className="text-xl text-center mt-5">{story.author_name}</h3>
                        <p className={"px-20 mt-10 " + sizes[this.state.fontSize]}>{story.story_text}</p>
                        </div>
                        <div className="sticky top-40 flex flex-col rounded-md bg-white h-40 w-40">
                            <div className="flex justify-center mb-5 pt-5">
                                <button value="large" onClick={this.fontChange} className="sticky top-1/4"><ArrowUpIcon className="h-5 w-5"/></button>
                                <button value="small" onClick={this.fontChange} className="sticky top-1/4"><ArrowDownIcon className="h-5 w-5"/></button>
                            </div>
                            <div className="flex ">
                                {this.state.tags.map(tag => (
                                    <div className="rounded bg-blue-50 px-1 pb-1 mx-1 hover:bg-blue-100">
                                        <Link to={{ pathname: "/tag/" + tag,
                                                state: {token: this.state.token, user: this.state.user}}}>
                                            {tag}
                                        </Link>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-around pt-9 w-auto">
                            <p className="flex"><ThumbUpIconOutline className="h-5 w-5"/>{story.likes}</p>
                            <p className="flex"><AnnotationIcon className="h-5 w-5"/>{this.state.comments.length}</p>
                            <p className="flex"><ChartBarIcon className="h-5 w-5"/>{this.state.story.view_count}</p>
                            </div>
                        </div>
                        </div>

                        <div className="flex justify-around">
                        <p className="mb-5">{this.state.comments.length} comments</p>
                        <div className="flex gap-3">
                        <p className="">{story.likes}</p>
                        <ThumbUpIconOutline className="h-7 w-7 cursor-pointer" onClick={this.onLike}/>
                        </div>
                        </div>
                        <form onSubmit={this.handleSubmit} className="flex justify-center mb-5">
                            <textarea className="resize-none w-6/12 rounded border-2 border-black-400 focus:outline-none focus:ring-2 focus:border-purple-300" rows="1" cols="30" name="comment_text" value={this.state.comment_text} onChange={this.handleChange}/>
                            <input type="submit" value="Comment" className="rounded py-1 px-1 bg-purple-700 text-white hover:bg-purple-400 hover:text-black cursor-pointer"/>
                        </form>
                        {this.state.comments.length !== 0 ? (
                        <ul>
                        {this.state.comments.map(comment => (
                            <div className="flex justify-center mt-1">
                            <li key={story.id} className="group w-1/2">
                            <div className="flex mb-4 bg-white rounded drop-shadow">
                                <div className="flex flex-col ml-5 p-4 max-w-xs">
                                <p>{comment.comment_text}</p>
                                <div className="flex ml-2">
                                <p className="ml-1">{comment.author_name}</p>
                                </div>
                                </div>
                            </div>
                            </li>  
                            </div>
                        ))}
                        </ul>
                        ) :(
                        <div className="flex justify-center">
                        <div className="text-center mb-20 bg-white w-6/12">
                        <div className="flex flex-col ml-5 p-4 max-w-xs">
                                <div className="flex ml-2">
                                <p className="ml-1">Be the first person to comment</p>
                                </div>
                                </div>
                        </div>
                        </div>
                        )
                        }

                    </div>
                    <div className="bg-gray-50 h-40 w-full">
                    </div>
                </div>
            );
        }   
    }
}