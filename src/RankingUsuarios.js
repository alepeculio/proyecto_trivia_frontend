import React, { Component } from 'react';
import Usuario from './Usuario';
import './RankingUsuarios.css';
import { withRouter } from "react-router-dom";
import {properties} from './properties.js'
const usuariosListaURL = properties.ip+':'+properties.puerto+'/usuarios/listar?cantidad=';

class RankingUsuarios extends Component{
	constructor(){
		super();
		this.state = {};
	}

	obtenerUsuarios(){
		let url;
		if(this.props.cantidad !== undefined){
			url = usuariosListaURL + this.props.cantidad;
		}else{
			url = usuariosListaURL + '10';
		}

		fetch(url,{
			method: 'GET',
			headers:{
				'Access-Control-Allow-Origin':'*',
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
					if(u.tipo !== 'Admin'){
						return(<Usuario key={u.id} usuario = {u}/>);
					}
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

export default withRouter( RankingUsuarios );