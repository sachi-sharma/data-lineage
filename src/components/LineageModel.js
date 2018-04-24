import React, { Component } from 'react'
import '../css/LineageModel.css'
import FaHome from 'react-icons/lib/fa/home'

var cytoscape = require('cytoscape');
const data = require('../../src/data/data.json');

class LineageModel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      elements: []
    };
    this.handleClick = this.handleClick.bind(this);
  }

  componentWillMount() {
    this.setState(prevState => ({
      elements: data.systems
    }));
    this.state.elements = data.systems
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
        name: 'grid'
      }
    });
  }

  render() {
    return (
      <div className="lineageWrapper">
        <button className="homeBtn" onClick={this.handleClick} size={70}><FaHome /></button>
        <div className="cy" id="cy"></div>
      </div>
    );
  }
}

export default LineageModel;
