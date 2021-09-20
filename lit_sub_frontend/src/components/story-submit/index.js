import React from 'react';
import NavBar from "../common/nav-bar";
import Selection from '../common/selection';
import Cookies from "js-cookie";
import { Redirect } from 'react-router';

export default class StorySubmit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            user: Cookies.get('user'),
            token: Cookies.get('token'),
            story_text: null,
            story_title: null,
            synopsis: null,
            submitted: false,
            selectedOption: null,
            tags: [],
            options: [],
            story_id: null,
        };
        this.url = "http://127.0.0.1:8000/" 
        this.handleChange = this.handleChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.handleTagChange = this.handleTagChange.bind(this)

    }

    handleTagChange(selectedOption){
        console.log(selectedOption)
        this.setState({
            selectedOption: selectedOption.map((option) => option.value)
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

    onSubmit(event){
        event.preventDefault();
        fetch(this.url+'story/submit/', {
            method: 'POST',
            mode: 'cors', 
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + this.state.token
            },
            body: JSON.stringify({story_title:this.state.story_title, synopsis:this.state.synopsis, story_text:this.state.story_text, tags:this.state.selectedOption})            
        })
        .then(res => {
            if (res.ok){
                return res.json();
            }
            throw new Error('Invalid submission');
        })
        .then(
            (result)=>{
                this.setState({
                    submitted: true,
                    story_id: result.id,
                })
            },
            (error) => {
                this.setState({
                    error
                })
            }
        )
    }
    
    componentDidMount(){
        fetch(this.url+'tag/')
        .then(res => res.json())
        .then((result) =>
            this.setState({
                tags: result,
            })
        )
        .then( () => {
            for (var i = 0; i < this.state.tags.length; i += 1) {
                this.state.options.push({value: this.state.tags[i].id, label: this.state.tags[i].tag_name})
            }
        })
    }

    render(){
        const {user, token} = this.state
        if (this.state.submitted){
            return(<Redirect to={"/story/" + this.state.story_id}/>);
        }
        else {
            return(
                <div>
                <NavBar user={user} token={token}/>
                <div className="bg-purple-50">
                <h1 class="text-4xl ml-28 pt-5 font-medium">New Submission</h1>
                <form onSubmit={this.onSubmit}>
                    <div class="pt-10 ml-10">
                    <div class="flex">
                        <label class="">
                        <p class="mr-16">Title:</p>
                        </label>
                        <input class="rounded border-2 border-black-400 focus:outline-none focus:ring-2 focus:border-purple-300 pl-3 w-96 py-2" name="story_title" type="text" value={this.state.story_title} onChange={this.handleChange} />
                    </div>
                    <div class="flex mt-5">
                        <label class="">
                        <p class="mr-8">Synopsis:</p>
                        </label>
                        <input class="rounded border-2 border-black-400 focus:outline-none focus:ring-2 focus:border-purple-300 pl-3 w-96 py-2" name="synopsis" type="text" value={this.state.synopsis} onChange={this.handleChange} />
                    </div>
                    </div>
                    <div class="mt-5 ml-10">
                    <label>
                    <p class="">Content:</p>
                    </label>
                    <textarea class="ml-24 rounded border-2 border-black-400 focus:outline-none focus:ring-2 focus:border-purple-300" rows="20" cols="100" name="story_text" value={this.state.story_text} onChange={this.handleChange}/>
                    </div>
                    <div>
                    <label>
                    <p class="ml-8">Tags:</p>
                    </label>
                    <Selection tags={this.state.tags}
                    token={this.state.token} 
                    handleTagChange={this.handleTagChange} 
                    options={this.state.options}
                    />
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
}