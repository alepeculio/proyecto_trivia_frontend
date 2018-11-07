/* eslint-disable */
import React, { Component } from 'react';
import {properties} from './properties.js';
const retarURL = properties.ip+properties.puerto+'/usuarios/retar';

class UsuarioLista extends Component{

	constructor(props){
		super();
	}

	
	retarUsuario(e){
		e.preventDefault();
		let retador = localStorage.getItem("usuario_id");
		let retado = this.props.usuario.id;
		console.log("COSO");
		this.props.retar(retador,retado);
	}
	
	render(){
		let usuario = this.props.usuario;
		return(
			<div className="usuario" >
			<img src={usuario.img} alt="Imagen usuario"/>
			<span className="nombre">{usuario.nombre} {usuario.apellido}</span>
			<span onClick={this.retarUsuario.bind(this)} className="retar">Retar</span>
			<span className="puntaje">{usuario.puntaje} pts.</span>
			</div>


			);
	}
}

export default UsuarioLista;