import React, { Component } from 'react';
import './Perfil.css';

class Perfil extends Component{
	render(){
		let u = this.props.usuario;
		let suscripcion;
		switch(u.tipo){
			case 'Admin':
			suscripcion = 'Eres un administrador de la plataforma.';
			break;
			case 'SinSuscripcion':
			suscripcion = 'No tienes una suscripción activa.';
			break;
			case 'Suscripcion':
			suscripcion = 'Tienes una suscripción activa!!, comienza a responder preguntas.'
			break;
			default: 
			suscripcion='';
			break;
		}
		console.log(u);
		return (
			<div className="perfil">
				<img src={u.img} alt="imagen perfil"/>
				<a className="btnCambiarImg">Cambiar</a>
				<h3 className="nombre">{u.nombre} {u.apellido}</h3>
				<span className="correo">{u.correo}</span>
				<span className="puntuacion"><b>Puntuación:</b> {u.puntaje}pts.</span>
				<span className="mmrestantes"><b>Mano a mano restantes:</b> {u.mmrestantes}</span>
				<span className="tipo">{suscripcion}</span>
			</div>
		);
	}
}

export default Perfil;