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
      filteredElements: [],
      systemList: []
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleNodeClick = this.handleNodeClick.bind(this);
  }

  componentWillMount() {
    this.setState(prevState => ({
      elements: data.systems
    }));
    this.state.elements = data.systems;
    /* Create system List for filter */
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
    this.renderDataLineage(this.state.elements);
  }

  handleClick() {
    this.props.history.push('/');
  }

  renderDataLineage(elements) {
    var cy = cytoscape({
      container: document.getElementById('cy'),
      elements: elements,
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
    var self = this;
    var filteredSysArray = [];
    var allNodesArray = this.state.elements.filter(function(element){
                            return element.type === "node";
                         });
    var sysAndEdgeArr = [];
    for(var idx in selected) {
        if(selected.length > 0) {
            var newNodes = (this.state.elements.filter(function(element){
                                                                    return (element.data.source === self.state.systemList[selected[idx]]
                                                                            || element.data.target === self.state.systemList[selected[idx]]
                                                                            || element.data.id === self.state.systemList[selected[idx]]);
                                                                  }));
            sysAndEdgeArr.push.apply(sysAndEdgeArr, newNodes);
            filteredSysArray.push(this.state.systemList[selected[idx]]);
        }
    }
    for (const idx in sysAndEdgeArr) {
                if (sysAndEdgeArr.hasOwnProperty(idx)) {
                    if(sysAndEdgeArr[idx].type === "edge") {
                        /*If edge source node is not in the array*/
                        var src = sysAndEdgeArr[idx].data.source;
                        if(!filteredSysArray.includes(src)) {
                            var node = allNodesArray.filter(function(element){
                                return (element.data.id ===  sysAndEdgeArr[idx].data.source);
                            });
                            sysAndEdgeArr.push(node[0]);
                        }
                        /*If edge target node is not in the array*/
                        var target = sysAndEdgeArr[idx].data.target;
                        if(!filteredSysArray.includes(target)) {
                            var node = allNodesArray.filter(function(element){
                                return (element.data.id ===  sysAndEdgeArr[idx].data.target);
                            });
                            sysAndEdgeArr.push(node[0]);
                        }
                    }
                }

    }
//    this.setState(prevState => ({
//        filteredElements: [
////            ...prevState.filteredElements,
//            sysAndEdgeArr
//        ]
//    }));
    this.state.filteredElements = sysAndEdgeArr;
    this.renderDataLineage(this.state.filteredElements);
  }

  render() {
    return (
      <div className="lineageWrapper">
        <button className="homeBtn" onClick={this.handleClick} size={70}><FaHome /></button>
        <div className="filterPanel">
            <List
                items={ this.state.systemList}
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
