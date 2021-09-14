import React from "react"
import { RadioGroup} from '@headlessui/react';
import { ChevronUpIcon } from "@heroicons/react/solid";

export default class DateRadio extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            selectedTime: "7 Days",
            isLoaded: false,
            error: null,
        }
        this.url = "http://127.0.0.1:8000/" 
        this.onChange = this.onChange.bind(this);
    }


    onChange(value){
        this.setState({
            selectedTime:value,
        })
        this.props.onOrderChange(value);
    }

    render(){
        const {selectedTime} = this.state
        return(
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
        )
    }
}