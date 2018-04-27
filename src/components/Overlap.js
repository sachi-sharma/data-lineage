import React, { Component } from 'react'
import ReactTable from "react-table";
import "react-table/react-table.css";

import '../css/Overlap.css'
import FaHome from 'react-icons/lib/fa/home'

const data = require('../../src/data/overlap.json')

class Overlap extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
    this.handleHomeClick = this.handleHomeClick.bind(this);
  }

  componentWillMount() {
    for(var idx in data.overlaps) {
      this.state.data.push( { "fieldName" : data.overlaps[idx].field,
                              "targetSystem" : data.overlaps[idx].dest,
                              "srcSystems" : data.overlaps[idx].sources
                            });
    }
  }

  componentDidMount() {
  }

  handleHomeClick() {
    this.props.history.push('/');
  }

  render() {
    return (
      <div className="overlapWrapper">
        <button className="homeBtn" onClick={this.handleHomeClick} size={70}><FaHome /></button>
        <ReactTable
          data={this.state.data}
          columns={[
            {
              Header: "Overlapping Systems",
              columns: [
                {
                  Header: "Fields",
                  accessor: "fieldName"
                },{
                  Header: "Target System",
                  accessor: "targetSystem"
                },{
                  Header: "Source Systems",
                  id: "srcSystems",
                  accessor: d => d.srcSystems
                }
              ]
            }
          ]}
          pivotBy={["fieldName"]}
          defaultPageSize={10}
          className="-striped -highlight"
        />
      </div>
    );
  }
}

export default Overlap;
