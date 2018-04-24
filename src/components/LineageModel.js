import React, { Component } from 'react'
import '../css/LineageModel.css'
import FaHome from 'react-icons/lib/fa/home'
import List from 'react-list-select'


var cytoscape = require('cytoscape');
const data = require('../../src/data/data.json');

class LineageModel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      elements: [],
      systemList: []
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleNodeClick = this.handleNodeClick.bind(this);
  }

  componentWillMount() {
    this.setState(prevState => ({
      elements: data.systems
    }));
    this.state.elements = data.systems
    var sysArray = data.systems.filter(function(element){
                                    return element.type === "node";
                                });
    this.state.systemList = sysArray.map(a => a.data.id);

  }

  loadSystems(system) {
    this.setState(prevState => ({
      systems: [
        ...prevState.systems,
        system
      ]
    }))
  }

  componentDidMount() {
    this.renderDataLineage();
  }

  handleClick() {
    this.props.history.push('/');
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
            'background-color': '#a94442',
            'label': 'data(id)'
          }
        },
        {
          selector: 'edge',
          style: {
            'curve-style': 'bezier',
            'width': 3,
            'line-color': '#ccc',
            'target-arrow-color': '#ccc',
            'target-arrow-shape': 'triangle'
          }
        }
      ],
      layout: {
        name: 'random'
      }
    });

    this.handleNodeClick(cy);

  }
  handleNodeClick(cy) {
      var systems = data.systems.filter(function(element){
          return element.type === "node";
      });
      for (const system in systems) {
          if (systems.hasOwnProperty(system)) {
              cy.$("#"+systems[system].data.id).on('tap', function(evt){
                    console.log(evt);
              });
           }
      }
  }

  handleFilter(selected) {
    console.log(selected)
    var self = this;
    for(var idx in selected) {
        console.log(this.state.systemList[selected[idx]])
        /*Fix to include all nodes that match source or destination*/
//        this.state.elements =   this.state.elements.filter(function(element){
//                                    return (element.data.source === self.state.systemList[selected[idx]]
//                                    || element.data.target === self.state.systemList[selected[idx]]);
//                                });
    }
    this.renderDataLineage();
  }

  render() {
    return (
      <div className="lineageWrapper">
        <button className="homeBtn" onClick={this.handleClick} size={70}><FaHome /></button>

        <div className="filterPanel">
            <List
                items={ this.state.systemList}
                selected={[0]}
                disabled={[4]}
                multiple={true}
                onChange={(selected: number) => { this.handleFilter(selected) }}
              />
        </div>

        <div className="cy" id="cy"></div>
      </div>
    );
  }
}

export default LineageModel;
