import React, { Component } from 'react';
import { Link } from "react-router-dom";
const retarURL = 'http://localhost:1234/usuarios/retar';

class UsuarioLista extends Component{

	constructor(){
		super();
		this.state = {};
	}

	handleClick(e){

		e.preventDefault();
		let id = localStorage.getItem("usuario_id");
		let usuario = this.props.usuario.id;
		this.retarUsuario(id,usuario);

	}

	retarUsuario(retador,retado){
		fetch( 'http://localhost:1234/preguntas/generarPreguntasDuelo', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json; charset=utf-8'
			},
			body: JSON.stringify( {
				ID_retador: retador,
				ID_retado: retado,
			} )
		} ).then( res => {

			return res.json();
		} ).then( pregunta => {
			console.log(pregunta);
		});

	}

	render(){
		let usuario = this.props.usuario;
		return(
			<Link title="Ver perfil" className="usuario" to={"/perfil/"+usuario.correo}>
			<img src={usuario.img} alt="Imagen usuario"/>
			<span className="nombre">{usuario.nombre} {usuario.apellido}</span>
			<span className="retar">Retar</span>
			<span className="puntaje">{usuario.puntaje} pts.</span>
			</Link>
			);
		}
	}

	export default UsuarioLista;