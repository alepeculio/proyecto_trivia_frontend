import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
//import Usuario from './Usuario';
import './IniciarSesionForm.css';
import {properties} from './properties.js'
const iniciarSesionURL = properties.ip+properties.puerto+'/usuarios/authLogin';
const meURL = properties.ip+properties.puerto+'/usuarios/authMe';

class IniciarSesionForm extends Component{
	constructor(){
		super();
		this.state = {
			error: false,
			irRanking:false,
			irAdmin: false,
			iniciando:false
		}
	}

	componentWillMount(){
		if(this.props.usuario !== '' )
			this.setState({irRanking:true});
	}

	iniciarSesion(e){
		e.preventDefault();

		this.setState({iniciando: true, error:false});

		let datos = {
			correo: e.target.correo.value,
			pass: e.target.pass.value
		};

		this.autenticarUsuario(datos);
	}

	autenticarUsuario(datos){
		fetch(iniciarSesionURL,{
			method: 'POST',
			headers: {
				'Access-Control-Allow-Origin':'*',
				'Content-Type': 'application/json; charset=utf-8'
			},
			body: JSON.stringify(datos)
		})
		.then(response => {
			return response.json();
		})
		.then(data => {
			if ( data.auth !== undefined && data.auth ) {

				fetch( meURL, {
					method: 'GET',
					headers: {
						'Access-Control-Allow-Origin':'*',
						'Content-Type': 'application/json; charset=utf-8',
						'x-access-token': data.token
					}
				} )
				.then( response => {
					return response.json();
				} )
				.then( usuario => {
					this.props.iniciarSesion(data.token, usuario);
					if(usuario.tipo === 'Admin')
						this.setState({irAdmin:true});
					else
						this.setState({irRanking:true});

				} )
				.catch( err => {
					console.log( err );
				} );
			} else {
				this.setState({error:true ,iniciando:false});
			}
		}).catch(err => {
			console.log(err);
			console.log('Reintentando...');
			setTimeout( this.autenticarUsuario(datos), 10000);
			
		});

	}

	render(){
		let error;
		let boton;

		if(this.state.irRanking){
			return <Redirect to='/ranking' />;
		}

		if(this.state.irAdmin){
			return <Redirect to='/admin' />;
		}

		if(this.state.iniciando){
			boton = <button disabled >Iniciando...</button>;
		}else{
			boton = <button>Iniciar Sesión</button>;
		}

		if(this.state.error){
			error = <span className="error">Correo o contraseña incorrectos</span>
		}

		return(
			<div className="iniciar_sesion_form">
			<h2>Iniciar Sesión</h2>
			<form method="POST" onSubmit = {this.iniciarSesion.bind(this)}>
			<label>Correo</label>
			<input required type="email" autoFocus name="correo"/>
			<label>Contraseña</label>
			<input required type="password" name="pass"/>
			{error}
			{boton}
			</form>
			</div>
			);
	}
}

export default IniciarSesionForm;