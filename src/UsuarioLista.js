import React, { Component } from 'react';

const retarURL = 'http://localhost:1234/usuarios/retar';

class UsuarioLista extends Component{

	constructor(){
		super();
		this.state = {};
	}

	handleClick(e){
		e.preventDefault();
		let id = localStorage.getItem("usuario_id");
		let usuario = this.props.usuario.id;
		this.retarUsuario(id,usuario);
	}

	retarUsuario(retador,retado){
		fetch(retarURL,{
			method: 'POST',
			headers:{
				'Content-Type': 'application/json; charset=utf-8'
			},
			body: JSON.stringify({
				ID_retador: retador,
				ID_retado: retado
			})
		})
		.then(response => {
			return response.json();
		})
		.then(data => {
			if(data.Error !== undefined){
				alert(data.Error);
				console.log(data.Error);
			}else{
				alert(data.Mensaje);
				console.log("OK", data.Mensaje);
			}})
		.catch(err => {
			console.log(err);
			console.log('Reintentando...');
			setTimeout( this.retarUsuario.bind(this) , 10000);
		});
	}

	render(){
		let usuario = this.props.usuario;
		return(
			<div onClick={this.handleClick.bind(this)} >
			<img src={usuario.img} alt="Imagen usuario"/>
			<span className="nombre">{usuario.nombre} {usuario.apellido}</span>
			<span className="puntaje">{usuario.puntaje} pts.</span>
			</div>
			);
	}
}

export default UsuarioLista;