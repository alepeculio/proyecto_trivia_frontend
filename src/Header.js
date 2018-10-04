import React, { Component } from 'react';
import { Link, withRouter} from "react-router-dom";
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
			titulo =<Link className='header-titulo'  title='Ir a inicio' to={'/inicio'}><img src={require('./logo.png')} alt='logo'/></Link>;
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
			titulo = <Link className='header-titulo log'  title='Ir al ranking' to={'/ranking'}><img src={require('./logo.png')} alt='logo'/></Link>;
			return(
				<header>
				{titulo}
				<div className="logueado">
				<img className="imagen" src={usuario.img} alt=""/>
				<span className="nombre"><Link title="Ver mi perfil" to="/perfil">{usuario.nombre} {usuario.apellido}</Link></span>
				<span className="puntuacion">Puntuación: {usuario.puntaje} pts.</span>
				<a className="boton iniciar-sesion" onClick={this.cerrarSesion.bind(this)} >Cerrar Sesión</a>
				</div>
				</header>
				);
		}
	}
	
}
export default withRouter( Header );