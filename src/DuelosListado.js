import React, { Component } from 'react';
import Duelo from './Duelo';
import DueloPropio from './DueloPropio';
import './RankingUsuarios.css';
import { withRouter } from "react-router-dom";

const duelosListaURL = 'http://localhost:1234/usuarios/listarRetos?id=';
const duelosPropiosListaURL = 'http://localhost:1234/usuarios/listarRetosPropios?id=';

class DuelosListado extends Component{
	constructor(){
		super();
		this.state = {};
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

	obtenerDuelosPropios(){
		let id = localStorage.getItem("usuario_id");
		fetch(duelosPropiosListaURL+id,{
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
				this.setState({duelosPropios: ''});
			}else if(data.Mensaje !== undefined){
				this.setState({duelosPropios: ''});
			}else{
				let duelosPropios = data.duelos.map(d => {
					return(
						<DueloPropio key={d.id} duelo = {d}/>
						);
				});
				this.setState({duelosPropios: duelosPropios});
			}})
		.catch(err => {
			console.log(err);
			console.log('Reintentando...');
			setTimeout( this.obtenerDuelosPropios.bind(this) , 10000);
		});
	}

	componentDidMount(){
		this.obtenerDuelos();
		this.obtenerDuelosPropios();
	}

	render(){
		let duelos = this.state.duelos;
		let duelosPropios = this.state.duelosPropios;
		if(duelos === undefined){
			duelos = <div className="cargando">Cargando...</div>
		}else if(duelos === ''){
			duelos = <div className="cargando">No hay duelos</div>
		}

		if(duelosPropios === undefined){
			duelosPropios = <div className="cargando">Cargando...</div>
		}else if(duelosPropios === ''){
			duelosPropios = <div className="cargando">No hay duelos</div>
		}

		let clase = 'usuarios_ranking';
		if(this.props.location.pathname === '/inicio'){
			clase += ' inicio';
		}

		return(
			<div className={clase}>
			{duelos}
			{duelosPropios}
			</div>
			);

		}
	}

	export default withRouter( DuelosListado );