import React, { Component } from 'react'
import '../css/Home.css'

class Home extends Component {

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(value) {
      this.props.history.push(value);
  }
  render() {
    return (
        <div className = "homeWrapper col-xs-12">
            <div className="col-xs-4 btnWrapper" id= "btnWrapper">
              <button id= "uploadBtn" onClick={() => this.handleClick("/")}>  Upload Data </button>
            </div>
            <div className="col-xs-4 btnWrapper" id= "viewLineage">
              <button id= "viewLineageBtn" onClick={() => this.handleClick("/model")}>  View Lineage Model</button>
            </div>
            <div className="col-xs-4 btnWrapper" id= "viewOverLap">
              <button id= "viewOverLapBtn" onClick={() => this.handleClick("/overlap")}>  View Overlap</button>
            </div>
        </div>
    );
  }
}

export default Home;
