import React, { Component } from 'react'
import 'react-select/dist/react-select.css'
import MultiSelectField from './MultiSelectField'
import '../css/LineageModel.css'
import FaHome from 'react-icons/lib/fa/home'

var cytoscape = require('cytoscape');
const data = require('../../src/data/data.json');

class LineageModel extends Component {

  constructor(props) {
    super(props);
    this.state = {
      elements: [],
      filteredElements: [],
      systemFilterList: [],
      systemList:[]
    };
    this.loadSystems = this.loadSystems.bind(this);
    this.handleHomeClick = this.handleHomeClick.bind(this);
    this.handleNodeClick = this.handleNodeClick.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.renderDataLineage = this.renderDataLineage.bind(this);
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
    for(var sys in this.state.systemList) {
      this.state.systemFilterList.push({"label":this.state.systemList[sys],"value":sys});
    }
  }

  componentDidMount() {
    this.renderDataLineage(this.state.elements);
  }

  loadSystems(system) {
    this.setState(prevState => ({
      systems: [
        ...prevState.systems,
        system
      ]
    }))
  }

  handleHomeClick() {
    this.props.history.push('/');
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

  handleFilterChange(selectedOption) {
    var selectedArr = selectedOption.split(",");
    var filteredSysArray = [], filteredElements = [];
    var allNodesArray = this.state.elements.filter(function(element){
                                                      return element.type === "node";
                                                  });
    /*If none is selected, render all*/
    if(selectedArr.length === 1 && selectedArr[0].length === 0) {
      this.renderDataLineage(this.state.elements);
      return;
    }
    /*Create array for selected nodes and edges*/
    var sysAndEdgeArr = [];
    var self = this;
    for(var idx in selectedArr) {
        if(selectedArr.length > 0) {
            var newNodes = (this.state.elements.filter(function(element){
                                                                    return (element.data.source === self.state.systemList[selectedArr[idx]]
                                                                            || element.data.target === self.state.systemList[selectedArr[idx]]
                                                                            || element.data.id === self.state.systemList[selectedArr[idx]]);
                                                                  }));
            sysAndEdgeArr.push.apply(sysAndEdgeArr, newNodes);
            filteredSysArray.push(this.state.systemList[selectedArr[idx]]);
        }
    }
    /*Create array for all related nodes*/
    for (const idx in sysAndEdgeArr) {
                if (sysAndEdgeArr.hasOwnProperty(idx)) {
                    if(sysAndEdgeArr[idx].type === "edge") {
                        /*If edge source node is not in the array*/
                        var src = sysAndEdgeArr[idx].data.source;
                        if(!filteredSysArray.includes(src)) {
                            var srcNode = allNodesArray.filter(function(element){
                                return (element.data.id ===  sysAndEdgeArr[idx].data.source);
                            });
                            sysAndEdgeArr.push(srcNode[0]);
                        }
                        /*If edge target node is not in the array*/
                        var target = sysAndEdgeArr[idx].data.target;
                        if(!filteredSysArray.includes(target)) {
                            var targetNode = allNodesArray.filter(function(element){
                                return (element.data.id ===  sysAndEdgeArr[idx].data.target);
                            });
                            sysAndEdgeArr.push(targetNode[0]);
                        }
                    }
                }

    }
    filteredElements = sysAndEdgeArr;
    /*If none is selected, render all*/
    if(filteredElements.length === 0)
        this.renderDataLineage(this.state.elements);
    else
        this.renderDataLineage(filteredElements);
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

  render() {
    return (
      <div className="lineageWrapper">
        <button className="homeBtn" onClick={this.handleHomeClick} size={70}><FaHome /></button>
        <div className="filterPanel">
    			<div className="section">
    				<MultiSelectField options={this.state.systemFilterList} action={(value) => this.handleFilterChange(value)}/>
    			</div>
        </div>
        <div className="cy" id="cy"></div>
      </div>
    );
  }
}

export default LineageModel;
