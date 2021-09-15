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
        const {user, token, stories, error, selectedTime, selectedOrder} = this.state
        return(
            <div>
            <NavBar user={user} token={token}/>
            <div class="bg-blue-50 min-h-screen h-full pt-7">
            <div class="relative">
            <h2 class="text-3xl mb-14 text-center">
                All Tags
            </h2>
            </div>
            <div>
            <ul>
            {this.state.tags.map(tag => (
                <div class="flex justify-center">
                <li key={tag.id} class="group w-1/2 mb-2">
                <Item>
                    <div class="flex flex-col ml-5 p-4 max-w-xs">
                    <Link class="font-medium text-xl" 
                        to={{ pathname: "/story/" + tag.tag_name,
                            state: {token: this.state.token, user: this.state.user}}}>
                    {tag.tag_name}
                    </Link>
                    </div>
                </Item>
                </li>  
                </div>
            ))}
            </ul>
            </div>
            </div>
            </div>
           
        );
    }
}