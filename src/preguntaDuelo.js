import React, { Component } from 'react';
import './Pregunta.css';


let green = '#11EA20';
let red = '#F81010';
let t = 15;

class PreguntaDuelo extends Component{


	constructor (props) {

		super();
		this.state = {
			contador: 3,//tiempo antes de que aparezca la pregunta
			shown: true,
			cronometro: t,//tiempo para responder
			inicio: false,
			lista : [],
			btn1: "white",
			btn2: "white",
			btn3: "white",
			btn4: "white",
			animation: "running",
			opbtn1: 1,
			opbtn2: 1,
			opbtn3: 1,
			opbtn4: 1,
			evbtn1: "auto"
		}
		this.inicio(props.id_Pregunta);

	}

	aumentarPuntuacion() {
		let pts = document.querySelector( ".puntuacion" );
		let str = pts.innerHTML.split( " " );
		let nuevo = parseInt( str[1] ) + 1;
		pts.innerHTML = "Puntuación: " + nuevo + " pts.";
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
		this.setState({inicio: true});
	}

	inicio($var){

	}
	conexion($var,$btn){
		this.setState({
			animation: "paused"
		})

		let estado;
		let tiempo = this.state.cronometro;
		if(this.props.correcta === $var ){
			estado = "Correcta";
		}else{
			estado = "Incorrecta";
		}
		if(estado  === "Correcta"){
			this.setState({
				[$btn]: green
			})
			for (var i = 0; i < 4; i++) {
				if(this.props.correcta !== this.state.lista[i]){
					var opbtn = "opbtn"+(1+i);
					this.setState({[opbtn]:0})	
				}

			}
		}else{

			this.setState({
				["ev"+$btn]: "none"
			})
			this.setState({
				[$btn]: red
			})
			for (i = 0; i < 4; i++) {
				if(this.props.correcta === this.state.lista[i]){
					this.setState({
						["evbtn"+(1+i)]: "none"
					})
					this.setState({["btn"+(1+i)]:green})
				}else{
					opbtn = "opbtn"+(1+i);
					var Incorrecta = "op"+$btn;
					if(opbtn !== Incorrecta){
						this.setState({[opbtn]:0})
					}
					
				}

			}
		}

		this.props.termino(estado,t-tiempo);

	}
	volver(){
		document.querySelector( '#contenedor' ).setAttribute( 'hidden', true );
		this.props.funcion();
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
			<div className="ContenedorTimer">
			<div className='timer'  style={shown} >
			<label className="texto">La pregunta aparecerá en </label>
			<br></br>
			<font className="contador">{this.state.contador}</font>
			<div className="wrapper" data-anim="base wrapper">
			<div className="circle" data-anim="base left"></div>
			<div className="circle" data-anim="base right"></div>
			</div>
			</div>
			</div>
			<div className="ContenedorPregunta" id="pregunta" style={hidden}>
			
			<div className="cabezera">

			<font className="pregunta">{this.props.pregunta}</font>
			</div>
			<div className="progress" style={{animationPlayState: this.state.animation}}></div>
			<br></br>
			<button className="button" style={{background: this.state.btn1 , opacity: this.state.opbtn1,pointerEvents : this.state.evbtn1}} id="0" onClick={()=>{this.conexion(this.state.lista[0],"btn1")}} type="button"><font className="txtRespuestas">{this.state.lista[0]}</font></button><br></br>
			<button className="button" style={{background: this.state.btn2 , opacity: this.state.opbtn2,pointerEvents : this.state.evbtn2}}  onClick={()=>{this.conexion(this.state.lista[1],"btn2")}}  type="button"><font className="txtRespuestas">{this.state.lista[1]}</font></button><br></br>
			<button className="button" style={{background: this.state.btn3 , opacity: this.state.opbtn3,pointerEvents : this.state.evbtn3}}  onClick={()=>{this.conexion(this.state.lista[2],"btn3")}} type="button"><font className="txtRespuestas">{this.state.lista[2]}</font></button><br></br>
			<button className="button" style={{background: this.state.btn4 , opacity: this.state.opbtn4,pointerEvents : this.state.evbtn4}}  onClick={()=>{this.conexion(this.state.lista[3],"btn4")}} type="button"><font className="txtRespuestas">{this.state.lista[3]}</font></button><br></br>
			</div>
			<div>
			<button className="volver" onClick={()=>{this.volver()}} style={hidden}>&laquo; Volver</button>
			</div>
			</div>



			);	
	}

}

export default PreguntaDuelo;