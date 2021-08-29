import React from 'react';


export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            user: null,
            authors: [],
            stories: [],
            token: null,
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
    }

    render() {
        const {error, isLoaded, user, authors, stories} = this.state;
        if (error) {
            return <div>Error: {error.message}</div>;
        }
        else{
            return(
                <div>
                    
                    <div>
                        <ul>
                        {stories.map(story => (
                        <li key={story.id}>
                            {story.story_title} {story.story_text}
                        </li>
                        ))}
                        </ul>   
                    </div>
                </div>
            );
        }
    }

}

