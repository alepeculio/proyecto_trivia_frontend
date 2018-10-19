import React, { Component } from 'react';

const cancelarURL = 'http://localhost:1234/usuarios/cancelarReto';

class DueloPropio extends Component{

	handleClick(e){
		e.preventDefault();
		let retador = localStorage.getItem("usuario_id");
		this.cancelarDuelo(retador,this.props.duelo.id);
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
			<div>
			<span className="nombre">{duelo.nombre} {duelo.apellido}</span>
			<span className="puntaje">{duelo.puntaje} pts.</span>
			<button onClick={this.handleClick.bind(this)}>Cancelar</button>
			</div>
			</div>
			);
	}
}

export default DueloPropio;