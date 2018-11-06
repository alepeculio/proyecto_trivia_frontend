import React, { Component } from 'react';
import UsuarioLista from './UsuarioLista';
import './RankingUsuarios.css';
import { withRouter } from "react-router-dom";

import Pregunta from './preguntaDuelo';

import {properties} from './properties.js'


const usuariosListaURL = properties.ip+properties.puerto+'/usuarios/usuariosSinRetar?id=';

const generarPreguntasDueloURL = properties.ip+properties.puerto+'/preguntas/generarPreguntasDuelo';

class UsuariosListado extends Component{

	constructor(props){

		super(props);
		this.state = {
			preguntas:null,
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
		console.log(generarPreguntasDueloURL);
		fetch(generarPreguntasDueloURL,{
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
			console.log("a");
		} ).then( preguntas => {
			console.log("B");
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
			this.setState({shown:true},()=>{
				this.setState({pregunta: b});
				this.setState({preguntas:preguntas});
				this.setState({retado:retado});
				document.querySelector( '.usuarios_ranking' ).setAttribute( 'hidden', true );

			});




		});
	}

	termino(estado,tiempo){

		this.setState({pregunta: null});
		console.log("Estado"+estado);
		console.log("Tiempo"+tiempo);
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
						document.querySelector( '.usuarios_ranking' ).removeAttribute('hidden');
						this.setState({shown:false});
					}).catch(err => {
						console.log(err);
					});
				}else{
					var siguiente = this.state.preguntas[this.state.contador];
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
		};
		var shown = {
			display: this.state.shown ? "block" : "none"
		};
		var aux ={display: "block"};

		return(
			<div >
			<div style={shown} >
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