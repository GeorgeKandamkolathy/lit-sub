import { RadioGroup } from '@headlessui/react';
import React from 'react';
import Item from '../common/item';
import NavBar from '../common/nav-bar';
import OrderList from '../common/order-list';
import DateRadio from '../common/date-radio';
import { Link } from 'react-router-dom';
import { ThumbUpIcon } from '@heroicons/react/solid';

export default class TagStory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: (this.props.location.state == undefined ? null : this.props.location.state.user),
            token: (this.props.location.state == undefined ? null : this.props.location.state.token),
            tag: this.props.match.params.tag_name,
            stories: [],
            selectedOrder: "all"
        };
        this.url = "http://127.0.0.1:8000/" 
    }

    
    componentDidMount(){
        fetch(this.url + "story/tag" + this.state.tag + "/")
        .then(res => res.json())
        .then(
            (result) => {
                this.setState({
                    isLoaded: true,
                    stories: result,
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
        const {user, token} = this.state
        return(
            <div>
                <NavBar user={user} token={token}/>
                <div class="bg-blue-50 h-full pt-7">
            <div class="relative">
            <h2 class="text-3xl mb-14 text-center">
                Tags
            </h2>
            <div class="absolute text-center left-27% top-12">
                <OrderList onOrderChange={(value) => {this.setState({selectedOrder:value})}}/>
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
        )
    }
}