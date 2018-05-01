import React from 'react';
import createClass from 'create-react-class';
import PropTypes from 'prop-types';
import Select from 'react-select';


 var MultiSelectField = createClass({
 	displayName: 'MultiSelectField',
 	propTypes: {
 		label: PropTypes.string,
 	},
 	getInitialState () {
 		return {
 			removeSelected: true,
 			disabled: false,
 			stayOpen: false,
 			value: [],
 			rtl: false
 		};
 	},
 	handleSelectChange (value) {
 		console.log('You\'ve selected:', value);
 		this.setState({ value });
 	},
 	render () {
 		const { disabled, stayOpen, value } = this.state;
 		return (
 			<div className="section">
 				<Select
 					closeOnSelect={!stayOpen}
 					disabled={disabled}
 					multi={this.props.multi}
 					onChange={(value) => { this.props.action(value); this.handleSelectChange(value);}}
 					options={this.props.options}
 					placeholder="Select System(s)"
           			removeSelected={this.state.removeSelected}
 					rtl={this.state.rtl}
 					simpleValue
 					value={value}
 				/>
 			</div>
 		);
 	}
 });

 export default  MultiSelectField;
