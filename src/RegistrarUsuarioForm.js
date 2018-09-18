import React, { Component } from 'react';
import './RegistrarUsuarioForm.css';

const registrarUsuarioURL = 'http://localhost:1234/usuarios/registro';

class RegistrarUsuarioForm extends Component{
	constructor(){
		super();
		this.state = {
			error: false
		}
	}

	registrarUsuario(event){
		event.preventDefault();

		const datos = new FormData();
		datos.append('correo', event.target.correo.value);
		datos.append('nombre',event.target.nombre.value);
		datos.append('apellido', event.target.apellido.value);
		datos.append('pass', event.target.pass.value);
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
				this.setState({error: 'El correo ingresado ya existe'});
			}else{
				this.props.registradoOk();
			}
			
		})
		.catch(err => {
			console.log(err);
		});
	}

	render() {
		let error = '';
		
		if(this.state.error){
			error = <span className="error">{this.state.error}</span>
		}

		return (
			<div className="registrar_usuario_form">
			<h2>Registrarse</h2>
			<form method="post" encType="multipart/form-data" onSubmit = {this.registrarUsuario.bind(this)}>
			<input required type="email" placeholder="Correo" name="correo"/>
			<input required type="text" placeholder="Nombre" name="nombre"/>
			<input required type="text" placeholder="Apellido" name="apellido"/>
			<input required type="password" placeholder="Contraseña" name="pass"/>
			<input type="file" placeholder="Imagen" name="img"/>
			{error}
			<button>Registrarse</button>
			</form>
			</div>
			);
	}
}

export default RegistrarUsuarioForm;