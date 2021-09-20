import React from 'react';
import { Link } from "react-router-dom";
import NavBar from "../common/nav-bar";
import { Listbox, Transition, RadioGroup, Tab} from '@headlessui/react';
import { ThumbUpIcon, ChevronDownIcon, ChevronUpIcon, SearchIcon } from '@heroicons/react/outline';
import Item from '../common/item';
import Cookies from "js-cookie"

export default class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            search: (this.props.location.state === undefined ? null : this.props.location.state.search),
            user: Cookies.get("user"),
            storyResults: [],
            authorResults: [],
            token: Cookies.get("token"),
            selectedOrder: "top",
            selectedTime: "7 Days",
        };
        this.url = "http://127.0.0.1:8000/" 
        this.componentDidMount = this.componentDidMount.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(event){
        const target = event.target;
        const value = target.value;
        const name = target.name;
        console.log(value)
        this.setState({
            [name]: value
        }, () => {
            fetch(this.url + "search/" + this.state.search)
            .then(res => res.json())
            .then((result) =>
            this.setState({
                isLoaded: true,
                storyResults: result['stories'],
                authorResults: result['users'],
            }),
            (error) =>
            this.setState({
                isLoaded: true,
                error,
            })
            )
        }
    )};

    componentDidMount(){
        fetch(this.url + "search/" + this.state.search)
        .then(res => res.json())
        .then((result) =>
            this.setState({
                isLoaded: true,
                storyResults: result['stories'],
                authorResults: result['users'],
            }),
            (error) =>
            this.setState({
                isLoaded: true,
                error,
            })
        )
    }
    
    render(){
        const {selectedTime, selectedOrder} = this.state
        return(
            <div>
            <NavBar searchBar={false}/>
            <div class="bg-blue-50 min-h-screen h-full pt-7">
            <div class="relative">
            <div className="flex justify-center">
            <SearchIcon className="h-5 w-5 mt-2"/>
            <form>
                <input className="ml-4 mb-2 border-b-2 drop-shadow-md border-black-700 focus:outline-none w-96 bg-blue-50" name="search" type="text" value={this.state.search} onChange={this.handleChange} />
            </form>
            </div>
            <h2 class="text-3xl mb-14 text-center">
            Results
            </h2>
            <div class="absolute text-center left-27% top-20">
            <Listbox value={selectedOrder} onChange={this.onChange}>
                <Listbox.Button class="inline-flex text-xl bg-gray-100 rounded-full w-auto pb-1 px-3 hover:bg-gray-300">
                    {selectedOrder}
                    <ChevronDownIcon
                        className="w-4 h-4 ml-2 mt-2 -mr-1 text-violet-200 hover:text-violet-100"
                        aria-hidden="true"
                    />
                </Listbox.Button>
                <Transition
                                  as={React.Fragment}
                                  enter="transition ease-out duration-100"
                                  enterFrom="transform opacity-0 scale-95"
                                  enterTo="transform opacity-100 scale-100"
                                  leave="transition ease-in duration-75"
                                  leaveFrom="transform opacity-100 scale-100"
                                  leaveTo="transform opacity-0 scale-95"
                >
                <Listbox.Options class="absolute left-1 w-20 mt-2 text-center bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <Listbox.Option
                        key={1}
                        value={"top"}
                    >
                        {({active}) => (
                        <p 
                            onClick={this.changeOrder}
                            className={`${ active ? "bg-purple-700 text-white": "text-gray-900"} 
                            group flex rounded-md items-center w-full px-2 py-2 text-sm cursor-pointer`}>
                        Top
                        </p>
                        )}
                    </Listbox.Option>
                    <Listbox.Option
                        key={2}
                        value={"new"}
                    >
                        {({active}) => (
                        <p 
                            class={`${ active ? "bg-purple-700 text-white": "text-gray-900"} 
                            group flex rounded-md items-center w-full px-1 py-2 text-sm cursor-pointer`}>
                        New
                        </p>
                        )}
                    </Listbox.Option>
                    <Listbox.Option
                        key={3}
                        value={"all"}
                    >
                        {({active}) => (
                        <p 
                            class={`${ active ? "bg-purple-700 text-white": "text-gray-900"} 
                            group flex rounded-md items-center w-full px-1 py-2 text-sm cursor-pointer`}>
                        All
                        </p>
                        )}
                    </Listbox.Option>
                </Listbox.Options>
                </Transition>
            </Listbox>
            </div>
            <div class="absolute top-20 right-1/4">
                <RadioGroup value={selectedTime} onChange={(value) => {this.setState({selectedTime:value})}}>
                    <RadioGroup.Label class="sr-only">Time</RadioGroup.Label>
                    <div class="flex">
                    <RadioGroup.Option value="7 Days" class="mr-3">
                    {({ checked }) => (
                        <div className="flex flex-col items-center">
                        <span className={checked ? 'underline text-blue-700' : ''}>7 Days</span>
                        <ChevronUpIcon className={checked ? 'h-5 w-5 -mt-1' : 'h-3 w-3 hidden'}/>
                        </div>  
                    )}</RadioGroup.Option>
                    <RadioGroup.Option value="30 Days" class="mr-3">
                    {({ checked }) => (
                        <div className="flex flex-col items-center">
                        <span className={checked ? 'underline text-blue-700' : ''}>30 Days</span>
                        <ChevronUpIcon className={checked ? 'h-5 w-5 -mt-1' : 'h-3 w-3 hidden'}/>
                        </div>
                    )}
                    </RadioGroup.Option>
                    <RadioGroup.Option value="Year" class="mr-3">                    
                    {({ checked }) => (
                        <div className="flex flex-col items-center">
                        <span className={checked ? 'underline text-blue-700' : ''}>Year</span>
                        <ChevronUpIcon className={checked ? 'h-5 w-5 -mt-1' : 'h-3 w-3 hidden'}/>
                        </div>
                    )}
                    </RadioGroup.Option>
                    <RadioGroup.Option value="All Time" class="mr-3">
                    {({ checked }) => (
                        <div className="flex flex-col items-center">
                        <span className={checked ? 'underline text-blue-700' : ''}>All Time</span>
                        <ChevronUpIcon className={checked ? 'h-5 w-5 -mt-1' : 'h-3 w-3 hidden'}/>
                        </div>
                    )}
                    </RadioGroup.Option>
                    </div>
                </RadioGroup>
            </div>
            </div>
            <div>                
                <Tab.Group>
                <div className="flex justify-center mb-4">
                <Tab.List>
                    <Tab
                    className={({ selected }) => 
                        (selected ? 'bg-blue-500 text-white ' : 'bg-purple-200 text-black ') +
                        ('rounded mr-4 p-3')
                    }
                    >
                    Stories
                    </Tab>
                    <Tab className={({ selected }) => 
                        (selected ? 'bg-blue-500 text-white ' : 'bg-purple-200 text-black ') +
                        ('rounded mr-4 p-3')
                    }>
                    Authors
                    </Tab>
                </Tab.List>
                </div>
                <Tab.Panels>
                    <Tab.Panel>
                    <ul>
                    {this.state.storyResults.map(story => (
                        <div class="flex justify-center">
                        <li key={story.id} class="group w-1/2 mb-2">
                        <Item>
                            <div class="flex flex-col ml-5 p-4 max-w-xs">
                            <Link class="font-medium text-xl" 
                                to={{ pathname: "/story/" + story.id}}>
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
                    </Tab.Panel>
                    <Tab.Panel>
                    <ul>
                    {this.state.authorResults.map(author => (
                        <div class="flex justify-center">
                        <li key={author.id} class="group w-1/2 mb-2">
                        <Item>
                            <div class="flex flex-col ml-5 p-4 max-w-xs">
                            <Link class="font-medium text-xl" 
                                to={{ pathname: "/author/" + author.id}}>
                            {author.username}
                            </Link>
                            </div>
                        </Item>
                        </li>  
                        </div>
                    ))}
                    </ul>
                    </Tab.Panel>
                </Tab.Panels>
                </Tab.Group>
            </div>
            </div>
            </div>
           
        );
    }
}