import React, { Component } from 'react';

const cancelarURL = 'http://localhost:1234/usuarios/cancelarReto';

class Duelo extends Component{

	handleClickCancelar(e){
		e.preventDefault();
		let retado = localStorage.getItem("usuario_id"); 
		this.cancelarDuelo(this.props.duelo.id,retado);
	}

	handleClickAceptar(e){
		e.preventDefault();
		console.log("CLIC ACEPTAR");
		console.log("DUELO:", this.props.duelo.id);
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
		return(
			<div>
			<img src={duelo.img} alt="Imagen usuario"/>
			<span className="nombre">{duelo.nombre} {duelo.apellido}</span>
			<span className="puntaje">{duelo.puntaje} pts.</span>
			<button onClick={this.handleClickAceptar.bind(this)}>Aceptar</button>
			<button onClick={this.handleClickCancelar.bind(this)}>Cancelar</button>
			</div>
			);
	}
}

export default Duelo;