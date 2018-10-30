import React, { Component } from 'react';
import DuelosListado from './DuelosListado';

import { withRouter } from "react-router-dom";

class Duelos extends Component{
	constructor(){
		super();
		
	}

	render(){
		return(
			<div>
			<DuelosListado />
			</div>
			);	
		}
	}

	export default withRouter( Duelos );