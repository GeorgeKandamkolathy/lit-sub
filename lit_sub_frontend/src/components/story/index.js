import React from 'react';
import { useParams } from "react-router";
import NavBar from "../common/nav-bar";

export default class Story extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            story_id: this.props.match.params.story_id,
            story: [],
            token: (this.props.location.state == undefined ? null : this.props.location.state.token),
        };
        this.url = "http://127.0.0.1:8000/" 
    }

    componentDidMount(){
        fetch(this.url + "story/" + this.state.story_id + "/", {
            method: 'GET',
            mode: 'cors', 
        })
        .then(res => res.json())
        .then(
            (result) => {
                this.setState({
                    isLoaded: true,
                    story: result
                });
            },
            (error) => {
                this.setState({
                  isLoaded: true,
                  error: error,
                });
            }
        )
    }


    render(){
        const {story, error} = this.state 
        console.log(this.props)
        console.log(story)
        if (error) {
            return <div>Error: {error.message}</div>;
        }
        else{
            return(
                <div>
                    <NavBar />
                    <div class="bg-purple-200 h-screen">
                        <div class="flex justify-center content-center items-center h-screen">
                        <div class="bg-white w-3/4 h-screen mt-20 rounded-lg ">
                        <h1 class="text-center mt-10 text-5xl font-medium">{story.story_title}</h1>
                        <h3 class="text-center mt-5">{story.author_name}</h3>
                        <p class="px-20 mt-10">{story.story_text}</p>
                        </div>
                    </div>
                    </div>
                </div>
            );
        }   
    }
}