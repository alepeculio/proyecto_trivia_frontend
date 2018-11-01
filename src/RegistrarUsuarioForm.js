import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import './RegistrarUsuarioForm.css';
import {properties} from './properties.js'
const registrarUsuarioURL = properties.ip+properties.puerto+'/usuarios/authRegistro';

class RegistrarUsuarioForm extends Component{
	constructor(){
		super();
		this.state = {
			error: false,
			irIniciarSesion: false,
			irRanking:false,
			registrandote:false
		}
	}

	componentWillMount(){
		if(this.props.usuario !== '')
			this.setState({irRanking:true});
	}


	registrarUsuario(event){
		event.preventDefault();

		this.setState({registrandote:true, error:false});

		let pass = event.target.pass.value;
		let confPass = event.target.confPass.value

		if(pass !== confPass){
			this.setState({error: 'Las contraseñas no coinciden'});
			return;
		}

		const datos = new FormData();
		datos.append('correo', event.target.correo.value);
		datos.append('nombre',event.target.nombre.value);
		datos.append('apellido', event.target.apellido.value);
		datos.append('pass', pass);
		datos.append('img', event.target.img.files[0]);

		fetch(registrarUsuarioURL,{
			method: 'POST',
			body: datos
		})
		.then(response => {
			return response.json();
		})
		.then(data => {
			if(data.Error !== undefined){
				if(data.Error.includes('duplicate key error')){
					this.setState({registrandote:false, error: 'El correo ingresado ya existe.'});
				}else if(data.Error.includes('validation failed')){
					this.setState({registrandote:false, error: 'El correo ingresado es incorrecto.'});
				}
			}else{
				this.setState({irIniciarSesion:true});
			}
			
		})
		.catch(err => {
			console.log(err);
		});
	}

	render() {
		if(this.state.irRanking){
			return <Redirect to='/ranking' />;
		}

		if(this.state.irIniciarSesion){
			return <Redirect to={'/iniciarSesion/registro_ok'} />;
		}

		let error;
		if(this.state.error){
			error = <span className="error">{this.state.error}</span>
		}

		let boton;
		if(this.state.registrandote){
			boton = <button disabled style={{width: 'inherit'}} >Registrandote...</button> 
		}else{
			boton = <button>Registrarse</button>
		}

		return (
			<div className="registrar_usuario_form">
			<h2>Registrarse</h2>
			<form method="post" encType="multipart/form-data" onSubmit = {this.registrarUsuario.bind(this)}>
			<label>Correo</label>
			<input autoFocus required type="email" name="correo"/>
			<label>Nombre</label>
			<input required type="text" name="nombre"/>
			<label>Apellido</label>
			<input required type="text" name="apellido"/>
			<label>Contraseña</label>
			<input required type="password" name="pass"/>
			<label>Confirmar contraseña</label>
			<input required type="password" name="confPass"/>
			<label>Imagen</label>
			<input type="file" name="img"/>
			{error}
			{boton}
			</form>
			</div>
			);
	}
}

export default RegistrarUsuarioForm;