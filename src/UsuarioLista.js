import React, { Component } from 'react';
import { Link } from "react-router-dom";
import Pregunta from './Pregunta';
const retarURL = 'http://localhost:1234/usuarios/retar';


class UsuarioLista extends Component{

	constructor(){
		super();
		this.state = {pregunta:null};
	}

	handleClick(e){
		e.preventDefault();
		let id = localStorage.getItem("usuario_id");
		let usuario = this.props.usuario.id;
		this.retarUsuario(id,usuario);

	}

	retarUsuario(e){
		e.preventDefault();
		let retado = this.props.usuario;
		let retador = localStorage.getItem("usuario_id");

		fetch( 'http://localhost:1234/preguntas/generarPreguntasDuelo', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json; charset=utf-8'
			},
			body: JSON.stringify( {
				ID_retador: retador,
				ID_retado: retado.id,
			} )
		} ).then( res => {
			return res.json();
		} ).then( preguntas => {
			var att = document.querySelectorAll('.ver');
			for (var i=0; i < att.length; i++) {
				att[i].setAttribute( 'hidden', true );
			}
			var primera = preguntas[0];
			var b = <Pregunta
			pregunta = {primera.pregunta}
			correcta = {primera.respuestas[0]}
			respuesta1 = {primera.respuestas[0]}
			respuesta2 = {primera.respuestas[1]}
			respuesta3 = {primera.respuestas[2]}
			respuesta4 = {primera.respuestas[3]}
			id_Pregunta = {primera._id}
			mostrar = {true}
			/>
			this.setState({pregunta: b});

		});
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