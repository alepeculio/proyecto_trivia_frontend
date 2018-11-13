/* eslint-disable */
import React, { Component } from 'react';
import PreguntaDuelo from './preguntaDuelo';
import './Duelo.css';
import {properties} from './properties.js';
import './Pregunta.css';

const cancelarURL = properties.ip+properties.puerto+'/usuarios/cancelarReto';
const obtenerPreguntasDueloURL = properties.ip+properties.puerto+'/preguntas/obtenerPreguntasDuelo';
const finalizarDueloURL = properties.ip+properties.puerto+'/usuarios/finalizarDuelo';

class Duelo extends Component{

	constructor () {
		var randomColor = "#"+Math.floor(Math.random()*16777215).toString(16);
		super();
		this.state = {
			pregunta:null, 
			color: "white",
			preguntas: null,
			cant_correctas: 0,
			tiempo: 0,
			cont: 0,
			respondiendo: false,
		};
	}

	handleClickCancelar(e){
		e.preventDefault();

		let btnsCancelar = document.getElementsByClassName("Cancelar");

		let retado = localStorage.getItem("usuario_id"); 

		for(let j=0; j < btnsCancelar.lenght;i++){
			btnsCancelar[j].disabled = true;
		}

		this.cancelarDuelo(this.props.duelo.id,retado);
	}

	handleClickAceptar(e){
		e.preventDefault();
		this.props.Aceptar(this.props.duelo.id);


	}


	cancelarDuelo(retador,retado){
		fetch(cancelarURL,{
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

			let btnsCancelar = document.getElementsByClassName("Cancelar");

			for(let i=0;i<btnsCancelar.lenght;i++){
				btnsCancelar[i].disabled = false;
			}

			if(data.Error !== undefined){
				alert(data.Error);
				console.log(data.Error);
			}else{
				alert(data.Mensaje);
				this.props.actualizarDuelos();
			}})
		.catch(err => {
			console.log(err);
			console.log('Reintentando...');
			setTimeout( this.cancelarDuelo.bind(this) , 10000);
		});
	}	

	render(){
		let duelo = this.props.duelo;

		var shown = {
			display:"block"
		};

		if(!this.state.respondiendo){
			//this.props.actualizarDuelos();
		}

		let asd = <div id="duelo" className="contenedorDuelo" >
		<img className="imgUser" src={duelo.img} alt="Imagen usuario"/>
		<span className="nombre">{duelo.nombre} {duelo.apellido} </span>

		<div className="buttons">
		<button className="Aceptar" onClick={this.handleClickAceptar.bind(this)}>Aceptar</button>
		<button className="Cancelar" onClick={this.handleClickCancelar.bind(this)}>Cancelar</button>
		</div>
		</div>;

		return(
			<div>
			{!this.state.respondiendo && asd}
			</div>
			);
		}
	}

	export default Duelo;