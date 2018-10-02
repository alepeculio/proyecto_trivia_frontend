import React, { Component } from 'react';
import { Link } from "react-router-dom";

class Usuario extends Component{
	
	render(){
		let usuario = this.props.usuario;
		return(
			<Link className="usuario" to={"/perfil/"+usuario.correo}>
			<img src={usuario.img} alt="Imagen usuario"/>
			<span className="nombre">{usuario.nombre} {usuario.apellido}</span>
			<span className="puntaje">{usuario.puntaje} pts.</span>
			</Link>
			);
	}
}

export default Usuario;