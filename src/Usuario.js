/* eslint-disable */
import React, { Component } from 'react';
import { Link } from "react-router-dom";

class Usuario extends Component{
	
	render(){
		let usuario = this.props.usuario;
		let posicion = this.props.posicion;
		let imagen;
		
		if(posicion == 0){
			imagen = <img className="medalla" src={require('./medalla-de-oro.png')} alt='primero'/>;
		}else if (posicion == 1){
			imagen = <img className="medalla" src={require('./medalla-de-plata.png')} alt='segundo'/>;
		}else if (posicion == 2){
			imagen = <img className="medalla" src={require('./medalla-de-bronce.png')} alt='tercero'/>;
		}else{
			imagen = '';
		}

		return(
			<Link title="Ver perfil" className="usuario" to={"/perfil/"+usuario.correo}>
			<img src={usuario.img} alt="Imagen usuario"/>	
			<span className="nombre">{usuario.nombre} {usuario.apellido}</span>
			<span className="puntaje">{usuario.puntaje} pts.</span>
			{imagen}
			</Link>
			);
		}
	}

	export default Usuario;