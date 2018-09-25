import React, { Component } from 'react';
import { BrowserRouter as Router ,Redirect } from "react-router-dom";
//import Usuario from './Usuario';
import './IniciarSesionForm.css';

const iniciarSesionURL = 'http://localhost:1234/usuarios/iniciarSesion';

class IniciarSesionForm extends Component{
	constructor(){
		super();
		this.state = {
			error: false,
			irInicio:false,
			iniciando:false
		}
	}

	componentDidMount(){
		let u = this.props.usuario;
		if(u !== '' ){
			this.setState({irInicio:true});
		}	
	}

	iniciarSesion(e){
		e.preventDefault();

		this.setState({iniciando: true, error:false});

		let datos = {
			correo: e.target.correo.value,
			pass: e.target.pass.value
		};

		fetch(iniciarSesionURL,{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json; charset=utf-8'
			},
			body: JSON.stringify(datos)
		})
		.then(response => {
			return response.json();
		})
		.then(data => {
			if(data.Mensaje !== undefined){
				this.setState({error:true ,iniciando:false});
			}else{
				this.props.iniciarSesion(data);
				this.setState({irInicio:true});
			}
		}).catch(err => {
			console.log(err);
		});
	}

	render(){
		let error;
		let boton;

		if(this.state.irInicio){
			return <Redirect to='/inicio' />;
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
			<input required type="email" autoFocus placeholder="Correo" name="correo"/>
			<input required type="password" placeholder="Contraseña" name="pass"/>
			{error}
			{boton}
			</form>
			</div>
			);
	}
}

export default IniciarSesionForm;