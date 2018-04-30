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
      systemList:[],
      showActionPopUp:'none'
    };
    this.loadSystems = this.loadSystems.bind(this);
    this.handleHomeClick = this.handleHomeClick.bind(this);
    this.handleNodeClick = this.handleNodeClick.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.renderDataLineage = this.renderDataLineage.bind(this);
    this.handleEditAction = this.handleEditAction.bind(this);
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

  handleEditAction(action) {
    this.setState({
          showActionPopUp: 'block'
    });
    switch(action) {
        case 'addNode':
            break;
        case 'addEdge':
            break;
        case 'removeNode':
            break;
        case 'removeEdge':
            break;
        case 'saveAction':
            this.saveAction();
            this.setState({
                showActionPopUp: 'none'
            });
            break;
        case 'closeActionPopUp':
            this.setState({
                showActionPopUp: 'none'
            });
            break;
    }
  }

  saveAction() {
    var srcSystem = document.getElementById("srcSystem").value;
    var newNode = { type: "node",
                    data: { "id": srcSystem, "color": "#a94442"}
                  }
    this.setState(prevState => ({
            elements: [
                ...prevState.elements,
                newNode
            ]
        }),
      () => this.renderDataLineage(this.state.elements));
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
            'background-color': 'data(color)',
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
        name: 'grid',
        rows: (this.state.systemList.length/2)
      }
    });

    this.handleNodeClick(cy);
  }

  render() {
    return (
      <div>
        <div className="lineageWrapper">
          <button className="homeBtn col-xs-12" onClick={this.handleHomeClick} size={70}><FaHome /></button>
          <div className="actionPanel col-xs-4">
            <div className="filterPanel">
              <div className="section">
                <MultiSelectField options={this.state.systemFilterList} action={(value) => this.handleFilterChange(value)}/>
              </div>
            </div>
            <div className="addRemovePanel">
              <button className="addNodeBtn col-xs-12" onClick={() => this.handleEditAction('addNode')} size={70}>Add Node</button>
              <button className="addEdgeBtn col-xs-12" onClick={() => this.handleEditAction('addEdge')} size={70}>Add Edge</button>
              <button className="removeNodeBtn col-xs-12" onClick={() => this.handleNodeAction('removeNode')} size={70}>Remove Node</button>
              <button className="removeEdgeBtn col-xs-12" onClick={() => this.handleEditAction('addEdge')} size={70}>Remove Edge</button>
            </div>
          </div>
          <div className="cy col-xs-8" id="cy"></div>
        </div>
        <div className="actionPopup" style={{display:this.state.showActionPopUp}}>
          <label>Source</label><br/><br/>
          <input id = "srcSystem" placeholder="Enter System Name"/><br/><br/>
          <label>Destination</label><br/><br/>
          <MultiSelectField options={this.state.systemFilterList} action={(value) => this.handleFilterChange(value)}/>
          <br/>
          <button className = "saveBtn" onClick={() => this.handleEditAction('saveAction')}>Save</button>
          <button className = "cancelBtn" onClick={() => this.handleEditAction('closeActionPopUp')}>Cancel</button>
        </div>
      </div>
    );
  }
}

export default LineageModel;
