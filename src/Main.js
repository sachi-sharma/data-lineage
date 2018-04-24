import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Home from './components/Home';
import LineageModel from './components/LineageModel';

const Main = () => (
  <main>
    <Switch>
      <Route exact path='/' component={Home}/>
      <Route path='/model' component={LineageModel}/>
    </Switch>
  </main>
)

export default Main
