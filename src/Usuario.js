import React, { Component } from 'react';

class Usuario extends Component{
	
	render(){ 
		return(
			<div className="usuario">
			<img src={this.props.img} alt="Imagen usuario"/>
			<span className="nombre">{this.props.nombre} {this.props.apellido}</span>
			<span className="puntaje">{this.props.puntaje} pts.</span>
			</div>
			);
		}
	}

	export default Usuario;

	/*
	<td><span>{this.props.id}</span></td>
	<td><span>{this.props.correo}</span></td>

	<td><span>{this.props.pass}</span></td>
	<td><span>{this.props.tipo}</span></td>
	<td><span>{this.props.mmrestantes}</span></td>
	*/