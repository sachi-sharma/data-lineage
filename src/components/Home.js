import React, { Component } from 'react'
import '../css/Home.css'

class Home extends Component {

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
      this.props.history.push('/model');
  }
  render() {
    return (
        <div className = "homeWrapper col-xs-12">
            <div className="col-xs-6 btnWrapper" id= "btnWrapper">
              <button id= "uploadBtn" onClick={this.handleClick}>  Upload Data </button>
            </div>
            <div className="col-xs-6 btnWrapper" id= "viewLineage">
              <button id= "viewLineageBtn" onClick={this.handleClick}>  View Lineage Model</button>
            </div>
        </div>
    );
  }
}

export default Home;
