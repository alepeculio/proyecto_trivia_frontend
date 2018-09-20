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