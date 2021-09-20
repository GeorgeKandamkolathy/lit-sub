import React from "react";
import CreatableSelect from 'react-select/creatable';
import Cookies from "js-cookie"

export default class Selection extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            options: this.props.options,
            isLoading: false,
            tags: Cookies.get('user'),
            value: [],
            token: Cookies.get('token'),
            error: null,
        }
        this.url = "http://127.0.0.1:8000/" 
        this.handleChange = this.handleChange.bind(this);
        this.handleCreate = this.handleCreate.bind(this);
    }

    handleChange = (newValue, actionMeta) => {
        this.setState({ value: newValue });
        this.props.handleTagChange(newValue);
    };

    handleCreate = (inputValue) => {
    this.setState({ isLoading: true });
        setTimeout(() => {
            const { options } = this.state;
            let newOption = null;
            fetch(this.url + "tag/create/", {
                method: "POST",            
                mode: 'cors', 
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Token ' + this.state.token
                },
                body: JSON.stringify({tag_name:inputValue})            
            })
            .then(res => res.json())
            .then((result) => {
                    newOption ={
                        label: result.tag_name,
                        value: result.id,
                    };
                },   
                (error) => {
                    this.setState({
                        error,
                    })
                }
            )
            .then(() => { 
                this.setState({
                    isLoading: false,
                    options: [...options, newOption],
                    value: [...this.state.value, newOption],
                }, () => {this.props.handleTagChange(this.state.value);
                });}
            )

        }, 1000);
    };

    render(){
        return (
            <CreatableSelect isClearable isMulti 
            onChange={this.handleChange} 
            onCreateOption={this.handleCreate} 
            options={this.state.options} 
            value={this.state.value}
            className="w-1/2 ml-8"
            />
        );
    }
}
