import React, { Component } from 'react';

var cytoscape = require('cytoscape');
const data = require('../../src/data/data.json');

class LineageModel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            elements: []
        };
    }

  componentWillMount() {
    this.setState(prevState => ({
            elements: data.systems
        }));
    this.state.elements = data.systems

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
    this.renderDataLineage();
    return (
      <div className="cytoscape" id="cy"></div>
    );
  }
}

export default LineageModel;
