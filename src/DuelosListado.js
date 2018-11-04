import React, { Component } from 'react';
import Duelo from './Duelo';
import { withRouter } from "react-router-dom";
import {properties} from './properties.js';
import './RankingUsuarios.css';

const duelosListaURL = properties.ip+properties.puerto+'/usuarios/listarRetos?id=';
const duelosPropiosListaURL = properties.ip+properties.puerto+'/usuarios/listarRetosPropios?id=';

class DuelosListado extends Component{
	constructor(){
		super();
		this.state = {shown: false};
	}

	obtenerDuelos(){
		let id = localStorage.getItem("usuario_id");
		fetch(duelosListaURL+id,{
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
				this.setState({duelos: ''});
			}else if(data.Mensaje !== undefined){
				this.setState({duelos: ''});
			}else{
				let duelos = data.duelos.map(d => {
					return(
						<Duelo key={d.id} duelo ={d} />
						);
				});
				this.setState({duelos: duelos});
			}})
		.catch(err => {
			console.log(err);
			console.log('Reintentando...');
			setTimeout( this.obtenerDuelos.bind(this) , 10000);
		});
	}

	componentDidMount(){
		this.obtenerDuelos();
	}

	render(){
		let clase = 'usuariosDuelo';
		let duelos = this.state.duelos;

		if(duelos === undefined){
			duelos = <div className="cargando">Cargando...</div>
		}else if(duelos === ''){
			duelos = <div className="cargando">No hay duelos</div>
		}

		if(this.props.location.pathname === '/inicio'){
			clase += ' inicio';
		};

		var shown = {
			display: this.state.shown ? "block" : "none",
			visibility : this.state.visibility ? "visible" : "hidden"
		};
	
		
		return(
			<div className={clase}>
			{duelos}
			</div>
			);

	}
}

export default withRouter( DuelosListado );