import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import Usuario from './Usuario';
import {properties} from './properties.js'

const ganadoresURL = properties.ip+properties.puerto+'/usuarios/ganadores';

class Ganadores extends Component{
	constructor(){
		super();
		this.state = {};
	}

	obtenerGanadores(){
		fetch(ganadoresURL,{
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
				this.setState({usuarios: ''});
			}else if(data.Mensaje !== undefined){
				this.setState({usuarios: ''});
			}else{
				let posicion;
				let usuarios = data.map((u, i) => {
					if(i == 0 || i == 1 || i == 2)
						posicion = i;
					return(<Usuario key={u.id} posicion={posicion} usuario = {u}/>);	
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
		this.obtenerGanadores();
	}

	render(){
		let usuarios = this.state.usuarios;
		if(usuarios === undefined){
			usuarios = <div className="cargando">Cargando...</div>
		}else if(usuarios === ''){
			usuarios = <div className="cargando">No hay ganadores anteriores</div>
		}

		let clase = 'usuarios_ranking inicio ganadores';

		return(
			<div className={clase}>	
			<h3>Ganadores de la semana anterior</h3>
			{usuarios}
			</div>
			);
		
	}
}

export default withRouter( Ganadores );