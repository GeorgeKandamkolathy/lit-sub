import React from 'react';
import { useParams } from "react-router";
import NavBar from "../common/nav-bar";
import { Listbox } from '@headlessui/react';

export default class Story extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            stories: [],
            token: (this.props.location.state == undefined ? null : this.props.location.state.token),
        };
        this.url = "http://127.0.0.1:8000/" 
    }

    componentDidMount(){
        fetch(this.url + "story/")
        .then(res => res.json())
        .then((result) =>
            this.setState({
                isLoaded: true,
                stories: result,
            }),
            (error) =>
            this.setState({
                isLoaded: true,
                error,
            })
        )
    }
    
    render(){
        const {token, stories, error} = this.state
        return(
            <div>
            <NavBar token={token}/>
            <h2>
                All Stories
            </h2>
            <>
            <>

            </div>
           
        );
    }
}