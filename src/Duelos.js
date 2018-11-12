/* eslint-disable */
import React, { Component } from 'react';
import DuelosListado from './DuelosListado';
import {properties} from './properties.js'
import { withRouter } from "react-router-dom";

class Duelos extends Component{
	constructor(){
		super();
		
	}

	render(){
		return(
			<div>
			<DuelosListado usuario={this.props.usuario} dueloAceptado = { this.props.dueloAceptado.bind( this ) } dueloFinalizado = { this.props.dueloFinalizado.bind( this ) } />
			</div>
			);	
		}
}

export default withRouter( Duelos );