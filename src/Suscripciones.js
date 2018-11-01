import React, { Component } from 'react';
import './Suscripciones.css';
import {properties} from './properties.js'
const usuariosListaURL = properties.ip+properties.puerto+'/usuarios/listar?cantidad=';
const actualizarSuscripcionURL = properties.ip+properties.puerto+'/usuarios/actualizarSuscripcion';

class Suscripciones extends Component{
	constructor(){
		super();
		this.state = {
			usuarios: ''
		};
	}

	componentDidMount(){
		this.obtenerUsuarios();
	}

	obtenerUsuarios(){
		let usuario = this.props.usuario;
		let url;
		if(this.props.cantidad !== undefined){
			url = usuariosListaURL + this.props.cantidad;
		}else{
			url = usuariosListaURL + '10';
		}

		fetch(url,{
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
				console.log(data.Error);
				this.setState({usuarios: ''});
			}else if(data.Mensaje !== undefined){
				this.setState({usuarios: ''});
			}else{
				let usuarios = data.usuarios.map(u => {
					if(u.id !== usuario.id)
						return(
							<div key={u.id} className="usuario" style={{backgroundColor: this.obtenerColor(u.tipo)}}>
							<img src={u.img} alt="Imagen usuario"/>
							<input readOnly hidden value={u.correo}/>
							<span className="nombre">{u.nombre} {u.apellido}</span>
							<select value={u.tipo} onChange={this.actualizarSuscripcion.bind(this)} >
							<option value="Admin" > Administrador </option>
							<option value="Suscripcion"> Suscripción </option>
							<option value="SinSuscripcion"> Sin Suscripción </option>
							</select>
							</div>
							);
				});
				this.setState({usuarios: usuarios});
			}})
		.catch(err => {
			console.log(err);
			console.log('Reintentando...');
			setTimeout( this.obtenerUsuarios.bind(this) , 10000);
		});
	}

	obtenerColor(tipo){
		let color;
		switch(tipo){	
			case 'Admin':
			color = 'rgb(27, 109, 125)';
			break;
			case 'Suscripcion':
			color = 'rgb(12, 107, 23)';
			break;
			case 'SinSuscripcion':
			color = 'rgb(125, 23, 23)';
			break;
			default:
			color = '';
			break;
		}
		return color;
	}

	actualizarSuscripcion(e){
		let select = e.target;
		let tipo = select.value;
		let usuarioDiv = select.parentNode;
		let correo = usuarioDiv.querySelector('input').value;
		select.disabled = true;

		fetch(actualizarSuscripcionURL,{
			method: 'POST',
			headers:{
				'Content-Type': 'application/json; charset=utf-8'
			},
			body:JSON.stringify({
				correo:correo,
				tipo:tipo
			})
		})
		.then(response => {
			return response.json();
		})
		.then(data => {
			if(data.Error !== undefined){
				console.log(data.Error);
			}else if(data.Mensaje !== undefined){
				select.value = tipo;
				usuarioDiv.style.backgroundColor = this.obtenerColor(tipo);
				select.disabled = false;
			}
		}).catch(err => {
			console.log(err);
			console.log('Reintentando...');
			setTimeout( this.obtenerUsuarios.bind(this) , 10000);
		});
	}

	render(){
		let usuarios = this.state.usuarios;
		if(usuarios === '')
			usuarios =  <div className='cargando'>Cargando...</div>;
		
		return (
			<div className='suscripciones'>
			<span className='titulo'>
			<h3>Suscripciones</h3>
			<span className='primero'>Usuario</span>
			<span className='segundo'>Tipo</span>
			</span>
			<div className='contenedor'>{usuarios}</div>
			</div>);
	}

}

export default Suscripciones;