import React from "react"
import { Listbox, Transition} from '@headlessui/react';
import { ChevronDownIcon } from "@heroicons/react/solid";

export default class OrderList extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            selectedOrder: "all",
            isLoaded: false,
            error: null,
        }
        this.url = "http://127.0.0.1:8000/" 
        this.onChange = this.onChange.bind(this);
    }


    onChange(value){
        this.setState({
            selectedOrder:value,
        })
        this.props.onOrderChange(value);
    }

    render(){
        const {selectedOrder} = this.state
        return(
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
                            class={`${ active ? "bg-purple-700 text-white": "text-gray-900"} 
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
        )
    }
}