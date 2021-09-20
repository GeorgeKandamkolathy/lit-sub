import React from 'react';
import { Link } from "react-router-dom";
import NavBar from "../common/nav-bar";
import { Listbox, Transition, RadioGroup} from '@headlessui/react';
import { ThumbUpIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/outline';
import Item from '../common/item';
import OrderList from '../common/order-list';
import DateRadio from '../common/date-radio';

export default class AuthorView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            user: (this.props.location.state == undefined ? null : this.props.location.state.user),
            authors: [],
            token: (this.props.location.state == undefined ? null : this.props.location.state.token),
            selectedOrder: "Top",
            selectedTime: "7 Days",
        };
        this.url = "http://127.0.0.1:8000/" 
        this.componentDidMount = this.componentDidMount.bind(this)
    }

    componentDidMount(){
        fetch(this.url + "author/?limit=100&offset=0")
        .then(res => res.json())
        .then((result) =>
            this.setState({
                isLoaded: true,
                authors: result.results,
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
                All Authors
            </h2>
            <div class="absolute text-center left-27% top-12">
                <OrderList onOrderChange={(value)=>this.setState({selectedOrder:value})}/>
            </div>
            <div class="absolute top-14 right-1/4">
                <DateRadio/>
            </div>
            </div>
            <div>
            <ul>
            {this.state.authors.map(author => (
                <div class="flex justify-center">
                <li key={author.id} class="group w-1/2 mb-2">
                <Item>
                    <div class="flex flex-col ml-5 p-4 max-w-xs">
                    <Link class="font-medium text-xl" 
                        to={{ pathname: "/author/" + author.id,
                            state: {token: this.state.token, user: this.state.user}}}>
                    {author.username}
                    </Link>
                    <div class="flex ml-2">
                    </div>
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