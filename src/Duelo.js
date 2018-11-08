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
			cont: 0
		};
	}

	handleClickCancelar(e){
		e.preventDefault();
		let retado = localStorage.getItem("usuario_id"); 
		this.cancelarDuelo(this.props.duelo.id,retado);
	}

	handleClickAceptar(e){
		e.preventDefault();
		let retado = localStorage.getItem("usuario_id"); 

		fetch( properties.ip+properties.puerto+'/preguntas/obtenerPreguntasDuelo', {

			method: 'POST',
			headers: {
				'Content-Type': 'application/json; charset=utf-8'
			},
			body: JSON.stringify( {
				ID_retado: retado,
				ID_retador: this.props.duelo.id
			} )
		} ).then( res => {
			return res.json();
		} ).then( preguntas => {
			if(preguntas.lenght !== 0){
				let primera = preguntas[0];
				let b = <PreguntaDuelo
				pregunta = {primera.pregunta}
				correcta = {primera.respuestas[0]}
				respuesta1 = {primera.respuestas[0]}
				respuesta2 = {primera.respuestas[1]}
				respuesta3 = {primera.respuestas[2]}
				respuesta4 = {primera.respuestas[3]}
				id_Pregunta = {primera._id}
				mostrar= {true}
				termino = {this.termino.bind(this)}
				/>
				document.querySelector( '.contenedorDuelo' ).setAttribute( 'hidden', true );
				this.setState({pregunta: b});
				this.setState({preguntas:preguntas});
			}
		});
	}

	termino(estado,tiempo){
		this.setState({pregunta: null});

		if(estado=="Correcta"){
			this.setState({cant_correctas:this.state.cant_correctas+1});
		}

		this.setState({tiempo:this.state.tiempo+tiempo});

		this.setState({cont:this.state.cont+1},()=>{
			
			if(this.state.cont == 3){

				fetch(finalizarDueloURL, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json; charset=utf-8'
					},
					body: JSON.stringify( {
						ID_retador: this.props.duelo.id,
						ID_retado: localStorage.getItem("usuario_id"),
						cant_correctas: this.state.cant_correctas,
						tiempo: this.state.tiempo
					} )
				} ).then(res=>{
					return res.json();
				}).then(data => {
					console.log(data);
					alert(data);
				}).catch(err => {
					console.log(err);
				});
			}else{
				var siguiente = this.state.preguntas[this.state.cont];
				var b = <PreguntaDuelo
				pregunta = {siguiente.pregunta}
				correcta = {siguiente.respuestas[0]}
				respuesta1 = {siguiente.respuestas[0]}
				respuesta2 = {siguiente.respuestas[1]}
				respuesta3 = {siguiente.respuestas[2]}
				respuesta4 = {siguiente.respuestas[3]}
				id_Pregunta = {siguiente._id}
				mostrar = {true}
				termino={this.termino.bind(this)}
				/>
				this.setState({pregunta: b});
			}
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
	
	render(){
		let duelo = this.props.duelo;

		var shown = {
			display:"block"
		};
		return(
			<div>
			{this.state.pregunta}
			<div id="duelo" className="contenedorDuelo" >
			<img className="imgUser" src={duelo.img} alt="Imagen usuario"/>
			<span className="nombre">{duelo.nombre} {duelo.apellido} </span>
			<span className="puntaje">{duelo.puntaje} pts.</span>

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