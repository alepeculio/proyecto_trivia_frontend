import React, { Component } from 'react';
import './Duelo.css';

class DueloPropio extends Component{
	
	render(){
		let duelo = this.props.duelo;
		return(
			<div>
			<div className="contenedorDuelo P">
			<img  className="imgUser" src={duelo.img} alt="Imagen usuario"/>
			<span className="nombre">{duelo.nombre} {duelo.apellido} </span>
			</div>
			</div>
			);
	}
}

export default DueloPropio;