import React, { Component } from 'react'
import '../css/Home.css'

class Home extends Component {

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handlefileUpload = this.handlefileUpload.bind(this);
  }
  handleClick(value) {
      this.props.history.push(value);
  }

  handlefileUpload(event){
    event.preventDefault();
    const data = new FormData();
    data.append('csv_file', this.uploadInput.files[0]);

    fetch('http://127.0.0.1:8000/fileUpload', {
      method: 'POST',
      body: data,
    }).then((response) => {
      
    });

  }



  render() {
    return (
        <div className = "homeWrapper col-xs-12">
        <form onSubmit = {this.handlefileUpload}>
          <div>
            <input ref={(ref) => { this.uploadInput = ref; }} type="file" />
          </div>
          <br />
          <div>
            <input type="submit" value="Upload"/>
          </div>
        </form>
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
