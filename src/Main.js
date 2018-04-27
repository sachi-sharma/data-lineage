import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Home from './components/Home';
import LineageModel from './components/LineageModel';
import Overlap from './components/Overlap';

const Main = () => (
  <main>
    <Switch>
      <Route exact path='/' component={Home}/>
      <Route path='/model' component={LineageModel}/>
      <Route path='/overlap' component={Overlap}/>
    </Switch>
  </main>
)

export default Main
