import React from 'react';
import { Link } from "react-router-dom";
import NavBar from "../common/nav-bar";
import { ThumbUpIcon, ChartBarIcon} from '@heroicons/react/outline';
import Item from '../common/item';
import OrderList from '../common/order-list';
import DateRadio from '../common/date-radio';
import Cookies from "js-cookie";
import InfiniteScroll from 'react-infinite-scroll-component';

export default class StoryView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            user: Cookies.get('user'),
            stories: [],
            stories_next: "",
            token: Cookies.get('token'),
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
                stories_next: result.next,
            }),
            (error) =>
            this.setState({
                isLoaded: true,
                error,
            })
        ))
    }

    componentDidMount(){
        fetch(this.url + "story/sort/top/?limit=50&offset=0")
        .then(res => res.json())
        .then((result) =>
            this.setState({
                isLoaded: true,
                stories: result.results,
                stories_next: result.next,
            }),
            (error) =>
            this.setState({
                isLoaded: true,
                error,
            })
        )
    }

    fetchMoreData = () => {
        fetch(this.state.stories_next)
        .then(res => res.json())
        .then((result) =>
            this.setState({
                isLoaded: true,
                stories: this.state.stories.concat(result.results),
                stories_next: result.next,
            }),
            (error) =>
            this.setState({
                isLoaded: true,
                error,
            })
        )
      };
      
    render(){
        const {user, token} = this.state
        return(
            <div>
            <NavBar user={user} token={token}/>
            <div class="bg-blue-50 min-h-screen h-full pt-7">
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
                <InfiniteScroll
                dataLength={this.state.stories.length}
                next={this.fetchMoreData}
                hasMore={true}
                loader={<h4>Loading...</h4>}
                >
                {this.state.stories.map(story => (
                    <div class="flex justify-center">
                    <div class="group w-1/2 mb-2">
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
                        <ChartBarIcon className="w-4 h-4 mt-1 ml-4"/>
                        <p class="ml-1">{story.view_count}</p>
                        </div>
                        </div>
                        <p class="mt-10 italic">{story.synopsis}</p>
                    </Item>
                    </div>  
                    </div>
                ))}                    
                </InfiniteScroll>
            </div>
            </div>
            </div>
           
        );
    }
}