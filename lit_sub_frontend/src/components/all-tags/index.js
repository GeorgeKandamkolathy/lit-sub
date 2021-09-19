import React from 'react';
import { Link } from "react-router-dom";
import NavBar from "../common/nav-bar";
import Item from '../common/item';

export default class TagView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            user: (this.props.location.state == undefined ? null : this.props.location.state.user),
            tags: [],
            token: (this.props.location.state == undefined ? null : this.props.location.state.token),
            selectedOrder: "top",
        };
        this.url = "http://127.0.0.1:8000/" 
        this.componentDidMount = this.componentDidMount.bind(this)
    }

    componentDidMount(){
        fetch(this.url + "tag/")
        .then(res => res.json())
        .then((result) =>
            this.setState({
                isLoaded: true,
                tags: result,
            }),
            (error) =>
            this.setState({
                isLoaded: true,
                error,
            })
        )
    }
    
    render(){
        const {user, token} = this.state
        return(
            <div>
            <NavBar user={user} token={token}/>
            <div class="bg-blue-50 min-h-screen h-full pt-7">
            <h2 class="text-3xl mb-14 text-center">
                All Tags
            </h2>
            <div class="flex flex-col">
            <div className="w-1/2 self-center bg-white p-2 rounded-md">
            <div class="flex justify-start">
            {this.state.tags.map(tag => (
                    <Link class="font-medium text-xl" 
                        to={{ pathname: "/tag/" + tag.tag_name,
                            state: {token: this.state.token, user: this.state.user}}}>
                    {tag.tag_name}
                    </Link>
            ))}
            </div>
            </div>
            </div>
            </div>
            </div>
           
        );
    }
}