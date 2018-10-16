import React, { Component } from 'react';
import UsuarioLista from './UsuarioLista';
import './RankingUsuarios.css';
import { withRouter } from "react-router-dom";

const usuariosListaURL = 'http://localhost:1234/usuarios/usuariosSinRetar?id=';

class UsuariosListado extends Component{
	constructor(){
		super();
		this.state = {};
	}

	obtenerUsuarios(){
		let id = localStorage.getItem("usuario_id");

		fetch(usuariosListaURL+id,{
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
					return(
						<UsuarioLista key={u.id} usuario = {u} />
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

	componentDidMount(){
		this.obtenerUsuarios();
	}

	render(){
		let usuarios = this.state.usuarios;
		if(usuarios === undefined){
			usuarios = <div className="cargando">Cargando...</div>
		}else if(usuarios === ''){
			usuarios = <div className="cargando">No hay usuarios</div>
		}

		let clase = 'usuarios_ranking';
		if(this.props.location.pathname === '/inicio'){
			clase += ' inicio';
		}

		return(
			<div className={clase}>
			{usuarios}
			</div>
			);

		}
	}

	export default withRouter( UsuariosListado );