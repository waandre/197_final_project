import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom'
import Groceries from './components/groceries'
import Home from './components/home'
import Bills from './components/bills'
import Chores from './components/chores'


class Main extends Component {
    render() {
      return (
        <main>
            <Switch>
                <Route exact path='/' component={Home}/>
                <Route path='/groceries' component={Groceries}/>
                <Route path='/bills' component={Bills}/>
                <Route path='/chores' component={Chores}/>
            </Switch>
        </main>
      );
    }
  }
export default Main
