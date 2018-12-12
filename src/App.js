import React, { Component } from 'react';
import Header from './header'
import Main from './main'

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Header />
          <Main />
        </header>
      </div>
    );
  }
}

export default App;
