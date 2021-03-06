/* eslint-disable */
import React, { Component } from 'react';
import Usuario from './Usuario';
import './RankingUsuarios.css';
import { withRouter, Link, Route } from "react-router-dom";
import {properties} from './properties.js'
const usuariosListaURL = properties.ip+properties.puerto+'/usuarios/listarRanking?cantidad=';


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
				let usuariosNormales = false;
				let usuarios = data.usuarios.map((u, i) => {
					//if ( u.tipo !== 'Admin' && u.tipo != 'SinSuscripcion' ) {
						usuariosNormales = true;
						let posicion;
						if(i == 0 || i == 1 || i == 2)
							posicion = i;

						return(<Usuario key={u.id} posicion={posicion} usuario = {u}/>);
					//}
				});
				if(usuariosNormales){
					this.setState({usuarios: usuarios});	
				}else{
					this.setState({usuarios: ''});
				}
				
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
			<br />
			<Link  to={"/ganadores"} className = "boton-ganadores">Ganadores de la semana anterior</Link>
			</div>
			);
		
	}
}

export default withRouter( RankingUsuarios );