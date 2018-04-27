import React, { Component } from 'react'
import '../css/Overlap.css'
import FaHome from 'react-icons/lib/fa/home'

class Overlap extends Component {

  constructor(props) {
    super(props);
    this.state = {
      elements: []
    };
    this.handleHomeClick = this.handleHomeClick.bind(this);
  }

  componentWillMount() {
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
      </div>
    );
  }
}

export default Overlap;
