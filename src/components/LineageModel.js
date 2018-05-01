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
      showAddNode:'none',
      showAddEdge:'none',
      showRemoveNode:'none',
      showRemoveEdge:'none',
      addNodeDestSystem: '',
      addEdgeSrcSystem:'',
      addEdgeDestSystem:'',
      removeEdgeSrcSystem:'',
      removeEdgeDestSystem:''
    };
    this.loadSystems = this.loadSystems.bind(this);
    this.createFilterList = this.createFilterList.bind(this);
    this.handleHomeClick = this.handleHomeClick.bind(this);
    this.handleNodeClick = this.handleNodeClick.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleEditAction = this.handleEditAction.bind(this);
    this.handlePopUpFilterChange = this.handlePopUpFilterChange.bind(this);
    this.saveChg = this.saveChg.bind(this);
    this.addNode = this.addNode.bind(this);
    this.addEdge = this.addEdge.bind(this);
    this.removeNode = this.removeNode.bind(this);
    this.removeEdge = this.removeEdge.bind(this);
    this.renderDataLineage = this.renderDataLineage.bind(this);
  }

  componentWillMount() {
    this.setState(prevState => ({
      elements: data.systems
    }));
    this.state.elements = data.systems;
    /* Create system List for filter */
    this.createFilterList();

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
    }));
  }

  createFilterList() {
    this.state.systemList = [];
    this.state.systemFilterList = [];
    var sysArray = this.state.elements.filter(function(element){
                       return element.type === "node";
                   });
    this.state.systemList = sysArray.map(a => a.data.id);
    for(var sys in this.state.systemList)
        this.state.systemFilterList.push({"label":this.state.systemList[sys],"value":sys});
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

  handleEditAction(action, subAction) {
    switch(action) {
        case 'addNode':
            this.setState({
                  showAddNode: 'block',
                  showAddEdge: 'none',
                  showRemoveNode: 'none',
                  showRemoveEdge: 'none'
            });
            break;
        case 'addEdge':
            this.setState({
                  showAddNode: 'none',
                  showAddEdge: 'block',
                  showRemoveNode: 'none',
                  showRemoveEdge: 'none'
            });
            break;
        case 'removeNode':
            this.setState({
                  showAddNode: 'none',
                  showAddEdge: 'none',
                  showRemoveNode: 'block',
                  showRemoveEdge: 'none'
            });
            break;
        case 'removeEdge':
            this.setState({
                  showAddNode: 'none',
                  showAddEdge: 'none',
                  showRemoveNode: 'none',
                  showRemoveEdge: 'block'
            });
            break;
        case 'saveChg':
            this.saveChg(subAction);
            this.setState({
                  showAddNode: 'none',
                  showAddEdge: 'none',
                  showRemoveNode: 'none',
                  showRemoveEdge: 'none'
            });
            break;
        case 'closePopUp':
            this.setState({
                  showAddNode: 'none',
                  showAddEdge: 'none',
                  showRemoveNode: 'none',
                  showRemoveEdge: 'none'
            });
            break;
    }
  }

  handlePopUpFilterChange(selected, action) {
    switch(action) {
        case 'addNodeDest':
          this.state.addNodeDestSystem = selected;
          break;
        case 'addEdgeSrc':
          this.state.addEdgeSrcSystem = selected;
          break;
        case 'addEdgeDest':
          this.state.addEdgeDestSystem = selected;
          break;
        case 'removeEdgeSrc':
          this.state.removeEdgeSrcSystem = selected;
          break;
        case 'removeEdgeDest':
          this.state.removeEdgeDestSystem = selected;
          break;
    }
  }

  saveChg(subAction) {
    switch(subAction) {
        case 'addNode':
          this.addNode();
          break;
        case 'addEdge':
          this.addEdge();
          break;
        case 'removeNode':
          this.removeNode();
          break;
        case 'removeEdge':
          this.removeEdge();
          break;
    }
  }

  addNode() {
    var srcSystem = document.getElementById("srcSystemAddNode").value;
    var isNodePresent = this.state.elements.filter(function(element){
                            return element.data.id === srcSystem;
                        });
    if(isNodePresent.length > 0 || srcSystem.length === 0)
      return;

    var newNode = { type: "node",
                    data: { "id": srcSystem, "color": "#a94442"}
                  }
    this.setState(prevState => ({
            elements: [
                ...prevState.elements,
                newNode
            ]
        }),
        () => {
                if(this.state.addNodeDestSystem.length > 0) {
                  var destSystems = this.state.addNodeDestSystem.split(',');    
                  for(var idx in destSystems) {
                    var destSys = this.state.systemList[destSystems[idx]].trim();
                    var newEdge = {
                                   "type": "edge",
                                   "data": {id: srcSystem+""+destSys, source: srcSystem, target: destSys}
                                  }
                    this.state.elements.splice(this.state.elements.length,0,newEdge);
                  }
                  this.renderDataLineage(this.state.elements)
                  this.createFilterList();
                }
                else {
                  this.renderDataLineage(this.state.elements)
                  this.createFilterList();
                }
        }
    );
  }

  addEdge(selected) {
    var srcSystem = this.state.elements[this.state.addEdgeSrcSystem];
    if(!srcSystem) return;
    srcSystem = srcSystem.data.id;
    if(srcSystem.length === 0 || this.state.addEdgeDestSystem.length === 0)
      return;
    if(this.state.addEdgeDestSystem.length > 0) {
      var destSystems = this.state.addEdgeDestSystem.split(',');
      for(var idx in destSystems) {
        var destSys = this.state.systemList[destSystems[idx]].trim();
        var edgeId = srcSystem+""+destSys;
        var isNodePresent = this.state.elements.filter(function(element){
                              return element.data.id === edgeId;
                            });
        if(isNodePresent.length > 0)
          return;
        var newEdge = {
                       "type": "edge",
                       "data": {id: edgeId, source: srcSystem, target: destSys}
                      }
        this.state.elements.splice(this.state.elements.length,0,newEdge);
      }
      this.renderDataLineage(this.state.elements);
    }
  }

  removeNode() {

  }

  removeEdge() {
    if(!this.state.removeEdgeSrcSystem || !this.state.removeEdgeDestSystem) return;
    var srcId = this.state.elements[this.state.removeEdgeSrcSystem].data.id;
    var destId = this.state.elements[this.state.removeEdgeDestSystem].data.id;
    if(srcId.length === 0 || destId.length === 0) return;
    var edgeId = srcId+""+destId;
    this.state.elements = this.state.elements.filter(function(element){
                              return element.data.id != edgeId;
                          });
    this.renderDataLineage(this.state.elements)
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
                <MultiSelectField multi = {true} options={this.state.systemFilterList} action={(value) => this.handleFilterChange(value)}/>
              </div>
            </div>
            <div className="addRemovePanel">
              <button className="addNodeBtn col-xs-12" onClick={() => this.handleEditAction('addNode')} size={70}>Add Node</button>
              <button className="addEdgeBtn col-xs-12" onClick={() => this.handleEditAction('addEdge')} size={70}>Add Edge</button>
              <button className="removeEdgeBtn col-xs-12" onClick={() => this.handleEditAction('removeEdge')} size={70}>Remove Edge</button>
            </div>
          </div>
          <div className="cy col-xs-8" id="cy"></div>
        </div>
        <div className="actionPopup" style={{display:this.state.showAddNode}}>
          <label>Source</label><br/>
          <input id = "srcSystemAddNode" placeholder="Enter System Name"/><br/><br/>
          <label>Destination</label><br/>
          <MultiSelectField multi = {true} options={this.state.systemFilterList} action={(value) => this.handlePopUpFilterChange(value,'addNodeDest')}/>
          <br/>
          <button className = "saveBtn" onClick={() => this.handleEditAction('saveChg','addNode')}>Save</button>
          <button className = "cancelBtn" onClick={() => this.handleEditAction('closePopUp')}>Cancel</button>
        </div>
        <div className="actionPopup" style={{display:this.state.showAddEdge}}>
          <label>Source</label>
          <br/>
          <MultiSelectField multi ={false} options={this.state.systemFilterList} action={(value) => this.handlePopUpFilterChange(value,'addEdgeSrc')}/>
          <br/><br/>
          <label>Destination</label>
          <br/>
          <MultiSelectField multi = {true} options={this.state.systemFilterList} action={(value) => this.handlePopUpFilterChange(value,'addEdgeDest')}/>
          <br/>
          <button className = "saveBtn" onClick={() => this.handleEditAction('saveChg','addEdge')}>Save</button>
          <button className = "cancelBtn" onClick={() => this.handleEditAction('closePopUp')}>Cancel</button>
        </div>
        <div className="actionPopup" style={{display:this.state.showRemoveEdge}}>
          <label>Source</label>
          <br/>
          <MultiSelectField multi = {false} options={this.state.systemFilterList} action={(value) => this.handlePopUpFilterChange(value,'removeEdgeSrc')}/>
          <br/><br/>
          <label>Destination</label>
          <br/>
          <MultiSelectField multi = {false} options={this.state.systemFilterList} action={(value) => this.handlePopUpFilterChange(value,'removeEdgeDest')}/>
          <br/>
          <button className = "saveBtn" onClick={() => this.handleEditAction('saveChg','removeEdge')}>Save</button>
          <button className = "cancelBtn" onClick={() => this.handleEditAction('closePopUp')}>Cancel</button>
        </div>
      </div>
    );
  }
}

export default LineageModel;
