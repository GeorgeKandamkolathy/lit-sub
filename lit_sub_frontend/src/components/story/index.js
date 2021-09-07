import React from 'react';
import StoryEdit from '../story-edit';
import StoryPublic from '../story-public';

export default class Story extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: (this.props.location.state == undefined ? null : this.props.location.state.user),
            story_id: this.props.match.params.story_id,
            story: null,
            token: (this.props.location.state == undefined ? null : this.props.location.state.token),
            is_authenticated: false,
        };
        this.url = "http://127.0.0.1:8000/" 
    }

    
    componentDidMount(){
        fetch(this.url + "story/" + this.state.story_id + "/")
        .then(res => res.json())
        .then(
            (result) => {
                this.setState({
                    isLoaded: true,
                    story: result,
                    is_authenticated: result['author_name'] == this.state.user,
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
        const {user, token, story_id} = this.state
        if (this.state.is_authenticated) {
            return (
                <StoryEdit user={user} token={token} story_id={story_id}/>
            );
        }
        else{
            return(
                <StoryPublic user={user} token={token} story_id={story_id}/>
            );
        }   
    }
}