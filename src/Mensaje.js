import React, { Component } from 'react';
import './Mensaje.css';

class Mensaje extends Component{

	render(){
		let mensaje = this.props.mensaje;
		let mostrar;
		if(mensaje !== undefined && mensaje !== false){
			mostrar = <span>{mensaje}</span>;
		}

		return(
			<div className={mensaje !== undefined && mensaje !== false ? 'mensaje' : 'mensaje-oculto'}>{mostrar}</div>
			);
	};
}

export default Mensaje;
