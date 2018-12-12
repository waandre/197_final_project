import React, { Component } from 'react';
import Login from './login'
import Signup from './signup'

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {response: "ok", login: true}
  }
  render() {
    var self = this
    var handleChange = function(newResponse) {
      self.setState({response: newResponse})
    }
    var toggleLogin = function() {
      self.setState({login: !self.state.login, response: 'ok'})
    }
    var error
    if (this.state.response !== "ok") {
      error = <p>{this.state.response}</p>
    }
    var feature
    if (this.state.login === true) {
      feature = <Login error={error} onMessageChange={handleChange} onSignup={toggleLogin}/>
    } else {
      feature = <Signup error={error} onMessageChange={handleChange} onReturnToLogin={toggleLogin}/>
    }
    return (
      <div>
        {feature}
      </div>
    );
  }
}

export default Home;
