import React, { Component } from 'react';
import DuelosListado from './DuelosListado';
import UsuariosListado from './UsuariosListado';
import { withRouter } from "react-router-dom";

class Duelos extends Component{
	constructor(){
		super();
		this.state = {};
	}

	render(){
		return(
			<div>
			<DuelosListado />
			<h2>Retar jugador</h2>
			<UsuariosListado />
			</div>
			);	
		}
	}

	export default withRouter( Duelos );