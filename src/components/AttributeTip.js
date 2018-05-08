import React, {Component} from 'react'

class AttributeTip extends Component {
    render() {
        return (
        	<div className= 'atributeTip' key={this.props.nodeId} id={this.props.nodeId} 
        	style={{left:this.props.left,top:this.props.top, display:'none'}}>
                {this.props.attrList}
             </div>
        );
    }
}

export default AttributeTip