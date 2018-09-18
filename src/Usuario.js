import React, { Component } from 'react';

class Usuario extends Component{
	
	render(){
		let usuario = this.props.usuario;
		return(
			<div className="usuario">
			<img src={usuario.img} alt="Imagen usuario"/>
			<span className="nombre">{usuario.nombre} {usuario.apellido}</span>
			<span className="puntaje">{usuario.puntaje} pts.</span>
			</div>
			);
	}
}

export default Usuario;

	/*
	<td><span>{usuario.id}</span></td>
	<td><span>{usuario.correo}</span></td>
	<td><span>{usuario.pass}</span></td>
	<td><span>{usuario.tipo}</span></td>
	<td><span>{usuario.mmrestantes}</span></td>
	*/