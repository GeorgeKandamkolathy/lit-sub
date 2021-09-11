import React from 'react';
import { Link } from "react-router-dom";
import NavBar from "../common/nav-bar";
import { Listbox, Transition, RadioGroup} from '@headlessui/react';
import { ThumbUpIcon, ChevronDownIcon } from '@heroicons/react/outline';

export default class StorySubmit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            user: (this.props.location.state == undefined ? null : this.props.location.state.user),
            token: (this.props.location.state == undefined ? null : this.props.location.state.token),
            story_text: null,
            story_title: null,
            synopsis: null,
            submitted: false,
        };
        this.url = "http://127.0.0.1:8000/" 
        this.handleChange = this.handleChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)

    }

    handleChange(event){
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });        
    }

    onSubmit(event){
        event.preventDefault();
        fetch(this.url+'story/submit/', {
            method: 'POST',
            mode: 'cors', 
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + this.state.token
            },
            body: JSON.stringify({story_title:this.state.story_title, synopsis:this.state.synopsis, story_text:this.state.story_text})            
        })
        .then(res => res.json())
        .then(
            (error)=>{
                this.setState({
                    submitted: true,
                    error
                })
            }
        )
    }

    render(){
        const {user, token} = this.state
        return(
            <div>
            <NavBar user={user} token={token}/>
            <div className="bg-purple-50">
            <h1 class="text-4xl ml-28 pt-5 font-medium">New Submission</h1>
            <form onSubmit={this.onSubmit}>
                <div class="pt-10 ml-10">
                <label class="">
                <div class="flex">
                    <p class="mr-16">Title:</p>
                    <input class="rounded border-2 border-black-400 focus:outline-none focus:ring-2 focus:border-purple-300 pl-3 w-96 py-2" name="story_title" type="text" value={this.state.story_title} onChange={this.handleChange} />
                </div>
                </label>
                <label class="">
                <div class="flex mt-5">
                    <p class="mr-8">Synopsis:</p>
                    <input class="rounded border-2 border-black-400 focus:outline-none focus:ring-2 focus:border-purple-300 pl-3 w-96 py-2" name="synopsis" type="text" value={this.state.synopsis} onChange={this.handleChange} />
                </div>
                </label>
                </div>
                <div class="mt-5 ml-10">
                <label>
                <p class="">Content:</p>
                <textarea class="ml-24 rounded border-2 border-black-400 focus:outline-none focus:ring-2 focus:border-purple-300" rows="20" cols="100" name="story_text" value={this.state.story_text} onChange={this.handleChange}/>
                </label>
                </div>
                <div className="flex flex-col items-center mt-5">
                <input type="submit" value="Submit" class="rounded mb-10 py-2 text-lg w-8/12 py-1 bg-purple-700 text-white hover:bg-purple-600 hover:text-black cursor-pointer"/>
                </div>
            </form>
            </div>
            </div>
        );
    }
}