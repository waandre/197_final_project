import React, { Component } from 'react';
import { withRouter }from 'react-router'

class Login extends Component {
  render() {
      var self = this
        var checkLogin = function(event) {
            event.preventDefault()
            var data = new FormData(event.target)
    
            fetch('/login', {
            method : 'POST',
            body : JSON.stringify({
                email: data.get('email'),
                pass: data.get('pass'),
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
    return (
        <div>
            <form onSubmit={checkLogin}>
                Email:
                <input type='text' placeholder='Email' name ='email'/> 
                Password:
                <input type='password' placeholder='Password' name='pass'/> 
                <button>Login</button>
            </form>
            {this.props.error}
            <p>New to Roomate Helper? Sign up <button onClick={this.props.onSignup}>here</button></p>
        </div>
        
    )
  }
}

export default withRouter(Login)