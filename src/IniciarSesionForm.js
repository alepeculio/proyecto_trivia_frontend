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
			irInicio:false
		}
	}

	componentDidMount(){
		let u = localStorage.getItem('usuario_logueado');
		if(u !== null && u !== undefined ){
			this.setState({ok:true});
		}	
	}

	iniciarSesion(e){
		e.preventDefault();

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
				this.setState({error:true});
			}else{
				this.props.iniciarSesion(data);
				this.setState({irInicio:true});
			}
		}).catch(err => {
			console.log(err);
		});
	}

	render(){
		let error = '';

		if(this.state.irInicio){
			return <Redirect to='/inicio' />;
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
		<button>Iniciar Sesión</button>
		</form>
		</div>
		);
	}
}

export default IniciarSesionForm;