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
    fetch('https://limitless-journey-57599.herokuapp.com/getOverlaps', {
      method: 'GET',
      mode:'cors'
    })
    .then(function(response) { return response.json(); })
    .then((response) => {
      var allOverlaps = []
      response.overlaps.forEach((overlap)=>{
        console.log(overlap);
        allOverlaps.push( { "fieldName" : overlap.field,
                              "targetSystem" : overlap.dest,
                              "srcSystems" : overlap.sources
                            });
      })
      this.setState({data : allOverlaps})
    }); 
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
                  accessor: "fieldName",
                },{
                  Header: "Target System",
                  accessor: "targetSystem",
                },{
                  Header: "Source Systems",
                  id: "srcSystems",
                  accessor: d => d.srcSystems,
                  aggregate: vals => {
                    var temp = []
                    vals.forEach((val)=>{
                      val.split(" , ").forEach((ele)=>{
                        temp.push(ele)
                      })
                    })
                    return [...new Set(temp)].join(" , ")
                  },
                  Aggregated: row => {
                    return (
                      <span>
                        {row.value}
                      </span>
                    );
                 },
                 filterMethod: (filter, row) => row[filter.id].toLowerCase().includes(filter.value.toLowerCase())
                }
              ]
            }
          ]}
          pivotBy={["fieldName", "targetSystem"]}
          defaultPageSize={10}
          filterable
          className="-striped -highlight"
        />
      </div>
    );
  }
}

export default Overlap;
