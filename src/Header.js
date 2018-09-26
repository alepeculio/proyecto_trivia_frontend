import React, { Component } from 'react';
import { BrowserRouter as Router, Link, withRouter} from "react-router-dom";
import './Header.css';

class Header extends Component {
	constructor(){
		super();
		this.state = {};
	}

	cerrarSesion(){
		this.props.cerrarSesion();
	}
	
	render(){
		let usuario = this.props.usuario;
		let url = this.props.location.pathname;
		let btnIniciarSesion = <Link className="boton iniciar-sesion" to={`/iniciarSesion`}>Iniciar Sesión</Link>;
		let btnRegistrarse = <Link className="boton registrarse" to={`/registrarse`}>Registrarse</Link>;
		let titulo;

		if(usuario === ''){
			titulo = <span className="header-titulo"><Link  title='Ir a inicio' to={'/inicio'}>TriviaTIP</Link></span>;
			if(url === '/iniciarSesion'){
				return  <header>{titulo}{btnRegistrarse}</header>;
			}else if(url === '/registrarse'){
				return  <header>{titulo}{btnIniciarSesion}</header>;
			}else{
				return  <header>{titulo}<Link className="boton segundo iniciar-sesion" to={`/iniciarSesion`}>Iniciar Sesión</Link>{btnRegistrarse}</header>;	
			}	
		}else if(usuario === 'cargando'){
			return  <header>{titulo}<span className='boton cargando'>Cargando...</span></header>;	
		}else{
			titulo = <span className="header-titulo"><Link  title='Ir al ranking' to={'/ranking'}>TriviaTIP</Link></span>;
			return(
				<header>
				{titulo}
				<div>
				<img src={usuario.img} alt=""/>
				<span className="header-nombre">{usuario.nombre} {usuario.apellido}</span>
				<span className="header-puntuacion">Puntuación: {usuario.puntaje} pts.</span>
				<a className="boton iniciar-sesion" onClick={this.cerrarSesion.bind(this)} >Cerrar Sesión</a>
				</div>
				</header>
				);
		}
	}
	
}

export default withRouter( Header );