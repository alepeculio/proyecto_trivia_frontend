import React, { Component } from 'react';
import Usuario from './Usuario';

const usuariosListaURL = 'http://localhost:1234/usuarios/listar?cantidad=10';
const usuarioObtener = 'http://localhost:1234/usuarios/obtener?correo=';

class ObtenerUsuarios extends Component{
	constructor(){
		super();
		this.state = {
			usuarios:[]
		};
	}

	componentDidMount(){
		if(this.props.correo === undefined){
			fetch(usuariosListaURL,{
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
				}else if(data.Mensaje !== undefined){
					console.log(data.Mensaje);
				}else{
					let usuarios = data.usuarios.map(u => {
						return(
							<Usuario
							key = {u.id}
							id = {u.id}
							img = {u.img}
							correo = {u.correo}
							nombre = {u.nombre}
							apellido = {u.apellido}
							pass = {u.pass}
							tipo = {u.tipo}
							mmrestantes = {u.mmrestantes}
							puntaje = {u.puntaje}
							/>
							);
					})
					this.setState({usuarios: usuarios});
				}})
			.catch(err => {
				console.log(err);
			});
		}else{
			let correo = this.props.correo;

			fetch(usuarioObtener+correo,{
				method: 'GET',
				headers:{
					'Content-Type': 'application/json; charset=utf-8'
				},
			})
			.then(response => {
				return response.json();
			})
			.then(u => {
				let usuario = devolverUsuario(u);
				this.setState({usuario: usuario});
			})
			.catch(err => {
				console.log(err);
			});

		}
	}

	render(){
		return(
			<div className="usuarios_ranking">
			<span className="titulo">Top 10 Ranking</span>
			{this.state.usuario}
			{this.state.usuarios}
			</div>
			);
	}
}

function devolverUsuario(u){
	if(u.Mensaje === undefined){
		return (
			<Usuario
			id = {u.id}
			img = {u.img}
			correo = {u.correo}
			nombre = {u.nombre}
			apellido = {u.apellido}
			pass = {u.pass}
			tipo = {u.tipo}
			mmrestantes = {u.mmrestantes}
			puntaje = {u.puntaje}
			/>
			);
	}else{
		return (<Usuario
			id= {u.Mensaje}
			/>);
	}
}

export default ObtenerUsuarios;