/* eslint-disable */
import React, { Component } from 'react';
import Duelo from './Duelo';
import DueloPropio from './DueloPropio';
import { withRouter } from "react-router-dom";
import {properties} from './properties.js';
import './RankingUsuarios.css';
import PreguntaDuelo from './preguntaDuelo';

const duelosListaURL = properties.ip+properties.puerto+'/usuarios/listarRetos?id=';
const duelosPropiosListaURL = properties.ip+properties.puerto+'/usuarios/listarRetosPropios?id=';
const cancelarURL = properties.ip+properties.puerto+'/usuarios/cancelarReto';
const obtenerPreguntasDueloURL = properties.ip+properties.puerto+'/preguntas/obtenerPreguntasDuelo';
const finalizarDueloURL = properties.ip+properties.puerto+'/usuarios/finalizarDuelo';

class DuelosListado extends Component{
	constructor(){
		super();

		this.state = {
			preguntaB:null, 
			color: "white",
			preguntas: null,
			cant_correctas: 0,
			tiempo: 0,
			cont: 0,
			respondiendo: false,
			shown: false
		};

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
						<Duelo Aceptar={this.Aceptar.bind(this)} key={d.id} duelo ={d} actualizarDuelos={this.actualizarDuelos.bind(this)} dueloAceptado = { this.props.dueloAceptado } dueloFinalizado = { this.props.dueloFinalizado } />

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
	Aceptar(DueloID){
		let retado = localStorage.getItem("usuario_id"); 
		document.querySelector(".Listado").setAttribute("hidden",true);		
		this.props.dueloAceptado(DueloID, retado );
		fetch(obtenerPreguntasDueloURL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json; charset=utf-8'
			},
			body: JSON.stringify( {
				ID_retado: retado,
				ID_retador: DueloID
			} )
		} ).then( res => {

			return res.json();
		} ).then( preguntas => {
			this.setState({respondiendo: true});
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
				duelo = {DueloID}
				termino = {this.termino.bind(this)}
				/>
				this.setState({pregunta: b});
				this.setState({preguntas:preguntas});
			}
		}).catch(err =>{
			
		});
	}
	termino(estado,tiempo,DueloID){
		this.setState({pregunta: null});

		if(estado=="Correcta"){
			this.setState({cant_correctas:this.state.cant_correctas+1});
		}

		this.setState({tiempo:this.state.tiempo+tiempo});

		this.setState({cont:this.state.cont+1},()=>{
			
			if(this.state.cont == 3){

				this.props.dueloFinalizado( this.state.cant_correctas, this.state.tiempo,DueloID, localStorage.getItem( 'usuario_id' ) );
				fetch(finalizarDueloURL, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json; charset=utf-8'
					},
					body: JSON.stringify( {
						ID_retador: DueloID,
						ID_retado: localStorage.getItem("usuario_id"),
						cant_correctas: this.state.cant_correctas,
						tiempo: this.state.tiempo
					} )
				} ).then(res=>{
					return res.json();
				}).then(data => {
					this.setState({respondiendo: false});
					window.location.reload();
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
				duelo = {DueloID}
				termino={this.termino.bind(this)}
				/>
				this.setState({pregunta: b});
			}
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
			<div className="pregunta">
			{this.state.pregunta}
			</div>
			<div className="Listado">
			{duelos}
			{duelosPropios}
			</div>
			</div>
			);

		}
	}

	export default withRouter( DuelosListado );