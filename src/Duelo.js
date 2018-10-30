import React, { Component } from 'react';
import Pregunta from './Pregunta';
import './Duelo.css';
import {properties} from './properties.js'
const cancelarURL = 'http://'+properties.ip+':'+properties.puerto+'/usuarios/cancelarReto';

class Duelo extends Component{


	constructor () {
		var randomColor = "#"+Math.floor(Math.random()*16777215).toString(16);
		console.log(randomColor);
		super();
		this.state = {pregunta:null, color: "white"};

	}
	handleClickCancelar(e){
		e.preventDefault();
		let retado = localStorage.getItem("usuario_id"); 
		this.cancelarDuelo(this.props.duelo.id,retado);
	}

	handleClickAceptar(e){
		e.preventDefault();
		let retado = localStorage.getItem("usuario_id"); 

		console.log("CLIC ACEPTAR");
		console.log("DUELO:", this.props.duelo.id);
		fetch( 'http://'+properties.ip+':'+properties.puerto+'/preguntas/generarPreguntasDuelo', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json; charset=utf-8'
			},
			body: JSON.stringify( {
				ID_retador: this.props.duelo.id,
				ID_retado: retado,
			} )
		} ).then( res => {
		
			return res.json();
		} ).then( pregunta => {
			console.log(pregunta);
		});
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
			if(data.Error !== undefined){
				alert(data.Error);
				console.log(data.Error);
			}else{
				alert(data.Mensaje);
				console.log("OK", data.Mensaje);
			}})
		.catch(err => {
			console.log(err);
			console.log('Reintentando...');
			setTimeout( this.cancelarDuelo.bind(this) , 10000);
		});
	}	

	generarPreguntaDuelo(){

		fetch( 'http://'+properties.ip+':'+properties.puerto+'/preguntas/generarPreguntaDuelo', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json; charset=utf-8'
			},
			body: JSON.stringify( {
				ID_retador: this.props.duelo.id,
				ID_retado: localStorage.getItem('usuario_id')
			} )
		} ).then( res => {
			return res.json();
		} ).then(pregunta => {
			document.querySelector("#duelo").setAttribute( 'hidden', true );
			var b = <Pregunta
			funcion = { this.terminoResp.bind( this ) }
			pregunta = {pregunta.pregunta}
			correcta = {pregunta.respuestas[0]}
			respuesta1 = {pregunta.respuestas[0]}
			respuesta2 = {pregunta.respuestas[1]}
			respuesta3 = {pregunta.respuestas[2]}
			respuesta4 = {pregunta.respuestas[3]}
			id_Pregunta = {pregunta._id}
			mostrar = {true}
			/>
			this.setState({pregunta: b});

		})
	}
	
	render(){
		let duelo = this.props.duelo;
		return(
			<div>
			{this.state.pregunta}
			<div id="duelo" className="contenedorDuelo" >
			<div className="contImg">
			<img className="imgUser" src={duelo.img} alt="Imagen usuario"/>
			</div>
			<div className="contInfo">
			<font className="nombre">{duelo.nombre} {duelo.apellido} </font>
			<font className="puntaje">{duelo.puntaje} pts.</font>
			</div>
			<div className="buttons">
			<button className="Aceptar" onClick={this.handleClickAceptar.bind(this)}>Aceptar</button>
			<button className="Cancelar" onClick={this.handleClickCancelar.bind(this)}>Cancelar</button>
			</div>
			
			</div>
			</div>
			);
	}
}

export default Duelo;