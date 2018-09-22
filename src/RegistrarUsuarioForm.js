import React, { Component } from 'react';
import { BrowserRouter as Router,Redirect} from "react-router-dom";
import './RegistrarUsuarioForm.css';

const registrarUsuarioURL = 'http://localhost:1234/usuarios/registro';

class RegistrarUsuarioForm extends Component{
	constructor(){
		super();
		this.state = {
			error: false,
			irIniciarSesion: false,
			irInicio:false
		}
	}

	componentDidMount(){
		let u = localStorage.getItem('usuario_logueado')
		if(u !== null && u !== undefined){
			this.setState({irInicio:true});
		}	
	}


	registrarUsuario(event){
		event.preventDefault();

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
					this.setState({error: 'El correo ingresado ya existe.'});
				}else if(data.Error.includes('validation failed')){
					this.setState({error: 'El correo ingresado es incorrecto.'});
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
		if(this.state.irInicio){
			return <Redirect to='/inicio' />;
		}

		if(this.state.irIniciarSesion){
			return <Redirect to={'/iniciarSesion/registro_ok'} />;
		}

		let error = '';
		if(this.state.error){
			error = <span className="error">{this.state.error}</span>
		}

		return (
			<div className="registrar_usuario_form">
			<h2>Registrarse</h2>
			<form method="post" encType="multipart/form-data" onSubmit = {this.registrarUsuario.bind(this)}>
			<input autoFocus required type="email" placeholder="Correo" name="correo"/>
			<input required type="text" placeholder="Nombre" name="nombre"/>
			<input required type="text" placeholder="Apellido" name="apellido"/>
			<input required type="password" placeholder="Contraseña" name="pass"/>
			<input required type="password" placeholder="Confirmar contraseña" name="confPass"/>
			<input type="file" placeholder="Imagen" name="img"/>
			{error}
			<button>Registrarse</button>
			</form>
			</div>
			);
	}
}

export default RegistrarUsuarioForm;