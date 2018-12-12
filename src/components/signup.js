import React, { Component } from 'react';
import { withRouter }from 'react-router'

class Signup extends Component {
    constructor(props) {
        super(props)
        this.state = {newRoomateAccount: "new"}
    }
  render() {
    var self = this
    var checkLogin = function(event) {
        event.preventDefault()
        var data = new FormData(event.target)
  
        fetch('/signup', {
          method : 'POST',
          body : JSON.stringify({
            first: data.get('first'),
            last: data.get('last'),
            email: data.get('email'),
            pass: data.get('pass'),
            values: data.get('values'),
            roomate: data.get('roomate')
          }),
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        })
        .then(resp => resp.json())
        .then(data => {
            if(data.message !== 'ok') {
                self.props.onMessageChange(data.message)
            } else {
                self.props.history.push('/groceries')
            }
        })
        
    }
    var selectChange = function(val) {
        self.setState({newRoomateAccount: val.target.value})
    }
    var feature
    if (this.state.newRoomateAccount === 'join') {
      feature = <input type='text' placeholder='Requested roomate email' name='roomate'/>
    } 
    return (
        <div>
            <form onSubmit={checkLogin}>
            First Name:
            <input type='text' placeholder='First Name' name='first'/> 
            Last Name: 
            <input type='text'placeholder='Last Name' name='last'/> 
            Email:
            <input type='text' placeholder='Email' name ='email'/> 
            Password:
            <input type='password' placeholder='Password' name='pass'/> 
            <select name='values' onChange={selectChange}>
                <option value='new'>Create New Roomate Group</option>
                <option value='join'> Join Existing Roomate Group</option>
            </select> 
            {feature}
            <button>Create Account</button>
            </form>
            {this.props.error}
            <button onClick={this.props.onReturnToLogin}>Return to login</button>
        </div>
    )
  }
}

export default withRouter(Signup)