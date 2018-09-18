import React, { Component } from 'react';
import './Header.css';

class Header extends Component {
	render(){
		let usuario = this.props.usuario;
		let registrarse = this.props.registrarse;
		let iniciarSesion = this.props.iniciarSesion;
		let header;
		if(usuario !== undefined){
			header = 
			<div>
				<img src={this.props.usuario.img} alt=""/>
				<span className="header-nombre">{this.props.usuario.nombre} {this.props.usuario.apellido}</span>
				<span className="header-puntuacion">Puntuación: {this.props.usuario.puntaje} pts.</span>
				<button onClick = {this.props.cerrarSesion.bind(this)}>Cerrar Sesión</button>
			</div>
		}else if(registrarse !== undefined){
			header = <div><button onClick = {registrarse.bind(this)}>Registrarse</button></div>
		}else if(iniciarSesion !== undefined){
			header = <div><button onClick = {iniciarSesion.bind(this)}>Iniciar Sesión</button></div>
		}

		return(
			<header>
				{header}	
			</header>
		);
	}
}

export default Header;
