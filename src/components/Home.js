import React, { Component } from 'react';
import '../css/Home.css';
import '../css/LineageModel.css';
import FaHome from 'react-icons/lib/fa/home';

import ToggleDisplay from 'react-toggle-display';
var cytoscape = require('cytoscape');
const data = require('../../src/data/data.json');
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
        showLineage: false
    };
    this.handleClick = this.handleClick.bind(this);
  }

  componentWillMount() {
    this.state.elements = data.systems
  }

  handleClick() {
      var self = this;
      if(!self.state.showLineage) {
         self.setState({
                showLineage: !self.state.showLineage
          });
         this.renderDataLineage();
         // self.props.history.push('/model')
      }
      else{
         self.setState({
              showLineage: !self.state.showLineage
          });
          // self.props.history.push('/')
      }
  }

  renderDataLineage() {
    var cy = cytoscape({
                        container: document.getElementById('cy'),
                        elements: this.state.elements,
                        directed: true,
                        style: [ 
                         {
                           selector: 'node',
                           style: {
                             'background-color': '#666',
                             'label': 'data(id)'
                           }
                         },
                         {
                           selector: 'edge',
                           style: {
                             'width': 3,
                             'line-color': '#ccc',
                             'target-arrow-color': 'turquoise',
                             'target-arrow-shape': 'triangle'
                           }
                         }
                       ],
                       layout: {
                         name: 'grid',
                         rows: 1
                       }
                    });
  }

  render() {
    return (
      <div className="wrapper">
        <ToggleDisplay show={!this.state.showLineage}>
          <div className = "homeWrapper col-xs-12">
            <div className="col-xs-6 btnWrapper" id= "btnWrapper">
              <button id= "uploadBtn" onClick={this.handleClick}>  Upload Data </button>
            </div>
            <div className="col-xs-6 btnWrapper" id= "viewLineage">
              <button id= "viewLineageBtn" onClick={this.handleClick}>  View Lineage Model</button>
            </div>
          </div>
        </ToggleDisplay>
        <ToggleDisplay show={this.state.showLineage}>
          <button className="homeBtn" onClick={this.handleClick} size={70}><FaHome /></button>
          <div className="cy" id="cy"></div>
        </ToggleDisplay>
      </div>
    );
  }
}

export default Home;
