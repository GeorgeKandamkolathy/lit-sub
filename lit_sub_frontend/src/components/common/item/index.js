import React from "react";

export default class Item extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render(){
        return(
            <div class="flex mb-4 bg-purple-200 rounded border-2 border-blue-50 drop-shadow group-hover:border-gray-300">
                <div class="left-1/4 bg-purple-700 w-10 h-auto rounded group-hover:bg-blue-700"/>
                    {this.props.children}
            </div>            
        );
    }
}