import React, { Component } from 'react';
import { withRouter, Redirect} from "react-router-dom";
import './Perfil.css';

const obtenerUsuarioURL = 'http://localhost:1234/usuarios/obtener?correo=';

class Perfil extends Component{
	constructor(){
		super();
		this.state = {
			usuario: 'cargando',
			actualizar : false
		};
	}

	obtenerUsuario(correo){
		fetch(obtenerUsuarioURL+correo,{
			method: 'GET',
			headers:{
				'Content-Type': 'application/json; charset=utf-8'
			},
		})
		.then(response => {
			return response.json();
		})
		.then(data => {
			if(data.Error !== undefined){
				this.setState({usuario: ''});
			}else if(data.Mensaje !== undefined){
				this.setState({usuario: ''});
			}else{
				this.setState({usuario: data});
			}})
		.catch(err => {
			console.log(err);
		});
	}

	setUsuario(usuarioLogueado){
		//let usuarioLogueado = this.props.usuario;
		let correo = this.props.history.location.pathname.split('/')[2];
		if(correo !== undefined && correo !== ''){
			this.obtenerUsuario(correo);
		}else if(usuarioLogueado !== ''){
			this.setState({usuario:usuarioLogueado});
		}else{
			console.log('entro');
			this.setState({usuario:''});
		}
	}

	componentDidMount(){
		this.setUsuario(this.props.usuario);
	}

	componentWillReceiveProps(nextProps){
		this.setUsuario(nextProps.usuario);
	}

	render(){
		let u = this.state.usuario;

		if(u === ''){
			return <Redirect to="/inicio" />;
		}

		if(u === 'cargando'){
			return <div className="perfil"><span className="cargando">Cargando...</span></div>;
		}

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

		return (
			<div className="perfil">
			<div className="contenedor-img">
			<img src={u.img} alt="imagen perfil"/>
			<a className="btnCambiarImg">Cambiar</a>
			</div>
			<div className="contenedor-info">
			<h3 className="nombre">{u.nombre} {u.apellido}</h3>
			<span className="correo">{u.correo}</span>
			<span className="puntuacion"><b>Puntuación:</b> {u.puntaje}pts.</span>
			<span className="mmrestantes"><b>Mano a mano restantes:</b> {u.mmrestantes}</span>
			<span className="tipo">{suscripcion}</span>
			</div>
			</div>
			);
	}
}

export default withRouter(Perfil);