/* eslint-disable */
import React, { Component } from 'react';
import Duelo from './Duelo';
import DueloPropio from './DueloPropio';
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
						<Duelo key={d.id} duelo ={d} actualizarDuelos={this.actualizarDuelos.bind(this)} dueloAceptado = { this.props.dueloAceptado } dueloFinalizado = { this.props.dueloFinalizado } />
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
						<DueloPropio key={d.id} duelo ={d} />
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

	actualizarDuelos(){
		this.obtenerDuelos();
		this.obtenerDuelosPropios();
	}

	solicitarSuscripcion(e){
		let btn = e.target;
		let u = this.props.usuario;
		btn.disabled = true;
		fetch( properties.ip+properties.puerto+'/usuarios/solicitar?id='+u.id+'&correo='+u.correo+'&nombre='+u.nombre+' '+u.apellido, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json; charset=utf-8'
			} 
		} ).then (res => {
			console.log(res);

		} ).catch( err => {
			btn.disabled = false;
			console.log( 'Error: ' + err );
		} );
	}

	render(){
		let clase = 'usuariosDuelo';
		let duelos = this.state.duelos;
		let duelosPropios = this.state.duelosPropios;

		if ( this.props.usuario === "cargando" )
			return null;
		else if ( this.props.usuario.tipo === undefined || this.props.usuario.tipo === "SinSuscripcion" ) {
			return(
				<div className="usuariosDuelo">
				<div className="SinSuscripcion">
				<p>Actualmente no posees una suscripción, puedes acceder a una cliqueando el botón de debajo.</p>
				<p>El costo de la misma es de $50, con vigencia hasta la finalización de esta semana.</p>
				<button onClick={this.solicitarSuscripcion.bind(this)}>Obtener suscripción</button>
				</div>
				</div>
				);
		}


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
			{duelosPropios}
			</div>
			);

	}
}

export default withRouter( DuelosListado );