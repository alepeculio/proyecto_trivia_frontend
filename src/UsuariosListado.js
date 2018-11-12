/* eslint-disable */
import React, { Component } from 'react';
import UsuarioLista from './UsuarioLista';
import './UsuariosListado.css';
import { withRouter } from "react-router-dom";

import Pregunta from './preguntaDuelo';

import {properties} from './properties.js';


const usuariosListaURL = properties.ip+properties.puerto+'/usuarios/usuariosSinRetar?id=';

const generarPreguntasDueloURL = properties.ip+properties.puerto+'/preguntas/generarPreguntasDuelo';

class UsuariosListado extends Component{

	constructor(props){

		super(props);
		this.state = {
			preguntas:"",
			pregunta : null,
			estado: 0,
			tiempo: 0,
			contador: 0,
			retado: null,
			shown: false,

		};
	}	



	obtenerUsuarios(){
		let id = localStorage.getItem("usuario_id");

		fetch(usuariosListaURL+id,{
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
				this.setState({usuarios: ''});
			}else if(data.Mensaje !== undefined){
				this.setState({usuarios: ''});
			}else{

				let usuarios = data.usuarios.map(u => {
					return(
						<UsuarioLista retar={this.retar.bind(this)}  key={u.id} usuario = {u} />
						);
				});
				this.setState({usuarios: usuarios});
			}})
		.catch(err => {
			console.log(err);
			console.log('Reintentando...');
			setTimeout( this.obtenerUsuarios.bind(this) , 10000);
		});
	}

	retar(retador,retado){
		fetch( generarPreguntasDueloURL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json; charset=utf-8'
			},
			body: JSON.stringify( {
				ID_retador: retador,
				ID_retado: retado,
			} )
		} ).then( res => {
			return res.json();
		} ).then( preguntas => {

			if(preguntas.Mensaje !== undefined){
				let btns = document.getElementsByClassName("Retar");

				for(let i=0; i < btns.length; i++) {
					btns[i].disabled = false;
				}
			}	

			var primera = preguntas[0];
			var b = <Pregunta
			pregunta = {primera.pregunta}
			correcta = {primera.respuestas[0]}
			respuesta1 = {primera.respuestas[0]}
			respuesta2 = {primera.respuestas[1]}
			respuesta3 = {primera.respuestas[2]}
			respuesta4 = {primera.respuestas[3]}
			id_Pregunta = {primera._id}
			mostrar = {true}
			termino={this.termino.bind(this)}
			/>
			this.setState({shown:true});
			console.log("Y"+this.state.preguntas);
			this.setState({preguntas:preguntas},()=>{
				this.setState({pregunta: b});
				this.setState({retado:retado});
				document.querySelector( '.usuarios_listado' ).setAttribute( 'hidden', true );

			});
			

		}).catch(function(err){
			console.log(err);
		});
	}

	termino(estado,tiempo){
		this.setState({pregunta: null});

		if(estado ==="Correcta"){
			this.setState({estado:this.state.estado+1});
		}

		this.setState({tiempo:this.state.tiempo+tiempo},()=>{

			this.setState({contador:this.state.contador+1},()=>{

				if(this.state.contador === 3){

					fetch( properties.ip+properties.puerto+'/usuarios/comenzarDuelo', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json; charset=utf-8'
						},
						body: JSON.stringify( {
							ID_retador: localStorage.getItem("usuario_id"),
							ID_retado: this.state.retado,
							cant_correctas: this.state.estado,
							tiempo: this.state.tiempo
						} )
					} ).then(res=>{
						return res.json();
					}).then(data => {
						console.log(data);
						
						let btns = document.getElementsByClassName("Retar");
						for(let i=0; i < btns.length; i++){
							btns[i].disabled = false;
						}
						this.setState({preguntas:""},()=>{
							this.setState({contador:0});
							this.setState({shown:false});
							this.obtenerUsuarios();
							document.querySelector( '.usuarios_listado' ).removeAttribute('hidden');
						});

						
					}).catch(err => {
						console.log(err);
					});
				}else{
					var siguiente = this.state.preguntas[this.state.contador];
					console.log(siguiente);
					var b = <Pregunta
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
			});});


	}
	componentDidMount(){
		this.obtenerUsuarios();
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
		let usuarios = this.state.usuarios;

		if ( this.props.usuario === "cargando" )
			return null;
		else if ( this.props.usuario.tipo === undefined || this.props.usuario.tipo === "SinSuscripcion" ) {
			return(
				<div className="usuarios_ranking">
				<div className="SinSuscripcion">
				<p>Actualmente no posees una suscripción, puedes acceder a una cliqueando el botón de debajo.</p>
				<p>El costo de la misma es de $50, con vigencia hasta la finalización de esta semana.</p>
				<button onClick={this.solicitarSuscripcion.bind(this)}>Obtener suscripción</button>
				</div>
				</div>
				);
		}

		if(usuarios === undefined){
			usuarios = <div className="cargando">Cargando...</div>
		}else if(usuarios === ''){
			usuarios = <div className="cargando">No hay usuarios</div>
		}

		let clase = 'usuarios_listado';
		if(this.props.location.pathname === '/inicio'){
			clase += ' inicio';
		};
		var shown = {
			display: this.state.shown ? "block" : "none"
		};
		var aux ={display: "block"};

		return(
			<div>
			<div style={shown} id="pdLista" >
			{this.state.pregunta}
			</div>
			<div className={clase} >
			{usuarios}
			</div>
			</div>
			);

		}
	}

	export default withRouter( UsuariosListado );