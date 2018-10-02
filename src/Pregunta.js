import React, { Component } from 'react';
import './Pregunta.css';



class Pregunta extends Component{

	constructor (props) {

		super();
		this.state = {
			contador: 5,
			shown: true,
			cronometro: 5,
			inicio: false,
			lista : []

		}
		this.inicio(props.id_Pregunta);

	}


	tickContador () {
		if(this.state.contador === 1){
			clearInterval(this.timer);
			this.setState({
				shown: !this.state.shown
			});
			this.timer = setInterval(this.tickCronometro.bind(this), 1000);


		}else{
			this.setState({contador: (this.state.contador - 1)})
		}
	}
	tickCronometro () {
		if(this.state.cronometro === 1){
			this.setState({cronometro: (this.state.cronometro - 1)})
			this.conexion("");

			//document.querySelector( '#contenedor' ).setAttribute( 'hidden', true );

		}else{
			this.setState({cronometro: (this.state.cronometro - 1)})
		}
	}


	startTimer () {
		clearInterval(this.timer)
		this.timer = setInterval(this.tickContador.bind(this), 1000)
		this.state.inicio = true;
	}

	inicio($var){

		let usuario_id = localStorage.getItem( 'usuario_id' );
		fetch( 'http://localhost:1234/preguntas/usuarioRespondio', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json; charset=utf-8'
			},
			body: JSON.stringify( {
				ID_Usuario: usuario_id,
				ID_Pregunta: $var,
				estado:"NoRespondio",
				tiempo:0
			} )

		} ).then(res => {
			return res.json();
		}).then(nose=>{
		}).catch( err => {
			console.log( "Error: "+err );
		} );
	}
	conexion($var){
		let estado;

		let tiempo = this.state.cronometro;

		if(this.props.correcta === $var ){
			estado = "Correcta"
		}else{
			estado = "Incorrecta"
		}

		let usuario_id = localStorage.getItem( 'usuario_id' );
		fetch( 'http://localhost:1234/preguntas/cambiarEstado', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json; charset=utf-8'
			},
			body: JSON.stringify( {
				ID_Usuario: usuario_id,
				ID_Pregunta: this.props.id_Pregunta,
				estado:estado,
				tiempo:tiempo
			} )

		} ).then(res => {
			clearInterval(this.timer);
			return res.json();
		}).then(nose=>{
			this.state.inicio = false;
			document.querySelector( '#contenedor' ).setAttribute( 'hidden', true );
			this.props.funcion();

		}).catch( err => {
			console.log( "Error: "+err );
		} );

	}


	render(){

		if(this.state.inicio === false){
			this.state.lista = [this.props.respuesta1,this.props.respuesta2,this.props.respuesta3,this.props.respuesta4];
			this.state.lista = this.state.lista.sort(function() {return Math.random() - 0.5});
			this.startTimer();
			
		}

		var shown = {
			display: this.state.shown ? "block" : "none"
		};
		
		var hidden = {
			display: this.state.shown ? "none" : "block"
		}

		return(
			<div id="contenedor">
			<div className='timer'  style={shown} >
			<label className="texto">La pregunta aparecera en </label>
			<br></br>
			<font className="contador">{this.state.contador}</font>
			<div className="wrapper" data-anim="base wrapper">
			<div className="circle" data-anim="base left"></div>
			<div className="circle" data-anim="base right"></div>
			</div>
			</div>

			<div className="ContenedorPregunta" id="pregunta" style={hidden}>
			<div className="cabezera">
			<font className="pregunta">{this.props.pregunta}</font>
			</div>
			<br></br>
			<button className="button" onClick={()=>{this.conexion(this.state.lista[0])}} type="button">{this.state.lista[0]}</button><br></br>
			<button className="button" onClick={()=>{this.conexion(this.state.lista[1])}}  type="button">{this.state.lista[1]}</button><br></br>
			<button className="button" onClick={()=>{this.conexion(this.state.lista[2])}} type="button">{this.state.lista[2]}</button><br></br>
			<button className="button" onClick={()=>{this.conexion(this.state.lista[3])}} type="button">{this.state.lista[3]}</button><br></br>
			<h1>{this.state.cronometro}</h1>
			</div>

 

			</div>



			);	
	}

}

export default Pregunta;