import React, { Component } from 'react';
import { withRouter, Redirect} from "react-router-dom";
import './Perfil.css';
import {properties} from './properties.js'
const obtenerUsuarioURL = properties.ip+properties.puerto+'/usuarios/obtener?correo=';
const cambiarPass = properties.ip+properties.puerto+'/usuarios/actualizarPass';

class Perfil extends Component{
	constructor(){
		super();
		this.state = {
			usuario: 'cargando',
			privado : false
		};
	}

	obtenerUsuario(correo, yo = false){
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
				this.setState({usuario: data, privado: yo});
			}})
		.catch(err => {
			console.log(err);
			console.log('Reintentando obtener usuario...');
			setTimeout(() => (this.obtenerUsuario(correo)), 10000);
		});
	}

	setUsuario(usuarioLogueado){
		let correo = this.props.history.location.pathname.split('/')[2];
		if(correo !== undefined && correo !== ''){
			this.obtenerUsuario( correo, usuarioLogueado.correo === correo );
		} else {
			this.obtenerUsuario( usuarioLogueado.correo, true );
		}
	}

	componentDidMount(){
		this.setUsuario(this.props.usuario);
	}

	componentWillReceiveProps(nextProps){
		this.setUsuario(nextProps.usuario);
	}

	cambiarPass() {
		let passAnterior = document.querySelector( '#passAnterior' );
		let pass1 = document.querySelector( '#pass1' );
		let pass2 = document.querySelector( '#pass2' );

		if ( pass1 === undefined || pass2 === undefined || passAnterior === undefined )
			return;

		let msjCambioPass = document.querySelector( '#msjCambioPass' );

		if ( pass1.value === '' || passAnterior.value === '' ) {
			if ( msjCambioPass === undefined )
				alert( 'Ingrese todos los campos' );
			else {
				msjCambioPass.innerHTML = 'Ingrese todos los campos';
				msjCambioPass.classList.remove( 'correcto' );
			}
		} else if ( pass1.value !== pass2.value ) {

			if ( msjCambioPass === undefined )
				alert( 'Las contraseñas no coinciden' );
			else {
				msjCambioPass.innerHTML = 'Las contraseñas no coinciden';
				msjCambioPass.classList.remove( 'correcto' );
			}
		} else {
			fetch( cambiarPass, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json; charset=utf-8'
				},
				body: JSON.stringify( {
					correo: this.state.usuario.correo,
					anterior: passAnterior.value,
					newpass: pass1.value
				} )
			} ).then( res => {
				return res.json();
			} ).then( res => {
				console.log( res );
				if ( res.Mensaje !== undefined ) {
					if ( res.Mensaje === 'si' ) {
						msjCambioPass.innerHTML = 'Contraseña cambiada!';
						msjCambioPass.classList.add( 'correcto' );
					} else {
						msjCambioPass.innerHTML = 'Contraseña actual incorrecta';
						msjCambioPass.classList.remove( 'correcto' );
					}
				} else {
					msjCambioPass.innerHTML = 'Fallo al cambiar contraseña';
					msjCambioPass.classList.remove( 'correcto' );
				}
			} ).catch( err => {
				console.log( err );
				msjCambioPass.innerHTML = 'Fallo al cambiar contraseña';
				msjCambioPass.classList.remove( 'correcto' );
			} );
		}
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

		let cambioPass = '';

		if ( this.state.privado ) {
			cambioPass =
			<div className = "cambioPass">
				<h3>Cambiar contraseña</h3>
				<form>
					<label>
						Contraseña actual
						<input type="password" name="passAnterior" id="passAnterior" placeholder="Contraseña anterior" required />
					</label>
					<div className="sep"></div>
					<label>
						Nueva contraseña
						<input type="password" name="pass1" id="pass1" required placeholder="Nueva contraseña" />
					</label>
					<div className="sep"></div>
					<label>
						Nueva contraseña
						<input type="password" name="pass2" id="pass2" required placeholder="Nueva contraseña" />
					</label>
					<div className="sep"></div>
					<button type="button" onClick = { () => { this.cambiarPass() } }>Confirmar</button>
					<span id="msjCambioPass"></span>
				</form>
			</div>;
		}


		return (
			<div className="perfil">
				<div className="contenedor-img">
					<img src={u.img} alt="imagen perfil"/>
				</div>
				<div className="contenedor-info">
					<h3 className="nombre">{u.nombre} {u.apellido}</h3>
					<span className="correo">{u.correo}</span>
					<span className="puntuacion"><b>Puntuación:</b> {u.puntaje}pts.</span>
					<div className={ this.state.privado ? '' : 'ocultar' }>
						<span className="mmrestantes"><b>Mano a mano restantes:</b> {u.mmrestantes}</span>
						<span className="tipo">{suscripcion}</span>
					</div>
				</div>
				{ cambioPass }
			</div>
		);
	}
}

export default withRouter(Perfil);