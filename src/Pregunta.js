import React, { Component } from 'react';

class Pregunta extends Component{

	 verga($var){
	 	var a = this.props.correcta;
	 	if(a === $var ){
	 		console.log("verga")
	 	}else{
	 		console.log("pito")
	 	}
	}
	render(){
		
		return(
			<div id="myModal" class="modal"  >
			<div class="modal-content" >
			<span class="close" onClick={()=>{document.getElementById('myModal').style.display = "none";}}>&times;</span><br></br>
			<label>{this.props.pregunta}</label>
			<button class="myButton" onClick={()=>{this.verga(this.props.respuesta1)}} type="button">{this.props.respuesta1}</button><br></br>
			<button class="myButton" onClick={()=>{this.verga(this.props.respuesta2)}}  type="button">{this.props.respuesta2}</button><br></br>
			<button class="myButton" onClick={()=>{this.verga(this.props.respuesta3)}} type="button">{this.props.respuesta3}</button><br></br>
			<button class="myButton" onClick={()=>{this.verga(this.props.respuesta4)}} type="button">{this.props.respuesta4}</button><br></br>
			</div>
			</div>
			);	
		}

	}

	export default Pregunta;