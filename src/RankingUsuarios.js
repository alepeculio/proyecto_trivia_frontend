import React, { Component } from 'react';
import Usuario from './Usuario';
import './RankingUsuarios.css';

let usuariosListaURL = 'http://localhost:1234/usuarios/listar?cantidad=';

class RankingUsuarios extends Component{
	constructor(){
		super();
		this.state = {};
	}

	componentDidMount(){
		if(this.props.cantidad !== undefined){
			usuariosListaURL += this.props.cantidad;
		}else{
			usuariosListaURL += '10';
		}

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
						<Usuario key={u.id} usuario = {u}/>
						);
				});
				this.setState({usuarios: usuarios});
			}})
		.catch(err => {
			console.log(err);
		});
	}

	render(){
		let usuarios = this.state.usuarios;
		if(usuarios === undefined){
			usuarios = <div className="cargando">Cargando...</div>
		}

		return(
			<div className="usuarios_ranking">
			<span className="titulo">Top 10 Ranking</span>
			{usuarios}
			</div>
			);
		
	}
}

export default RankingUsuarios;