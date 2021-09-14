import React from 'react';
import { Link } from "react-router-dom";
import NavBar from "../common/nav-bar";
import { Listbox, Transition, RadioGroup} from '@headlessui/react';
import { ThumbUpIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/outline';
import Item from '../common/item';
import OrderList from '../common/order-list';
import DateRadio from '../common/date-radio';

export default class StoryView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            user: (this.props.location.state == undefined ? null : this.props.location.state.user),
            stories: [],
            token: (this.props.location.state == undefined ? null : this.props.location.state.token),
            selectedOrder: "top",
            selectedTime: "7 Days",
        };
        this.url = "http://127.0.0.1:8000/" 
        this.componentDidMount = this.componentDidMount.bind(this)
        this.onOrderChange = this.onOrderChange.bind(this)
    }

    onOrderChange(value){
        this.setState({
            selectedOrder: value
        }, () => fetch(this.url + "story/sort/"+ this.state.selectedOrder +"/?limit=100&offset=0")
        .then(res => res.json())
        .then((result) =>
            this.setState({
                isLoaded: true,
                stories: result.results,
            }),
            (error) =>
            this.setState({
                isLoaded: true,
                error,
            })
        ))
    }

    componentDidMount(){
        fetch(this.url + "story/sort/top/?limit=100&offset=0")
        .then(res => res.json())
        .then((result) =>
            this.setState({
                isLoaded: true,
                stories: result.results,
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
            <div class="bg-blue-50 h-full pt-7">
            <div class="relative">
            <h2 class="text-3xl mb-14 text-center">
                All Stories
            </h2>
            <div class="absolute text-center left-27% top-12">
                <OrderList onOrderChange={this.onOrderChange}/>
            </div>
            <div class="absolute top-14 right-1/4">
                <DateRadio/>
            </div>
            </div>
            <div>
            <ul>
            {this.state.stories.map(story => (
                <div class="flex justify-center">
                <li key={story.id} class="group w-1/2 mb-2">
                <Item>
                    <div class="flex flex-col ml-5 p-4 max-w-xs">
                    <Link class="font-medium text-xl" 
                        to={{ pathname: "/story/" + story.id,
                            state: {token: this.state.token, user: this.state.user}}}>
                    {story.story_title}
                    </Link>
                    <div class="flex ml-2">
                    <Link class="font-bold ml-4 w-auto" to={"author/"+story.author}>{story.author_name}</Link>
                    <ThumbUpIcon class="w-4 h-4 mt-1 ml-4" />
                    <p class="ml-1">{story.likes}</p>
                    </div>
                    </div>
                    <p class="mt-10 italic">{story.synopsis}</p>
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