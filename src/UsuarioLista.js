/* eslint-disable */
import React, { Component } from 'react';
import {properties} from './properties.js';
import './Duelo.css';
const retarURL = properties.ip+properties.puerto+'/usuarios/retar';

class UsuarioLista extends Component{

	constructor(props){
		super();
	}

	retarUsuario(e){
		e.preventDefault();
		let retador = localStorage.getItem("usuario_id");
		let retado = this.props.usuario.id;
		this.props.retar(retador,retado);

	}
	
	render(){
		let usuario = this.props.usuario;
		return(
			<div className="usuario" >
			<img src={usuario.img} alt="Imagen usuario"/>
			<span className="nombre">{usuario.nombre} {usuario.apellido}</span>
			<button className="Retar" onClick={this.retarUsuario.bind(this)}>Retar</button>
			<span className="puntaje">{usuario.puntaje} pts.</span>
			</div>


			);
	}
}

export default UsuarioLista;