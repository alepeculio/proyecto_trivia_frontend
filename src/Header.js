import React, { Component } from 'react';
import { BrowserRouter as Router,Redirect, Link} from "react-router-dom";
import './Header.css';

class Header extends Component {
	constructor(props){
		super(props);
		this.state = {
			usuario: this.props.usuario,
			irInicio: false
		};
	}

	cerrarSesion(e){
		this.props.cerrarSesion('');
		this.setState({usuario: ''})
	}
	
	render(){
		let usuario = this.state.usuario;
		let url = this.props.match.url;

		if(usuario !== ''){
			return(
				<header>
				<span className="header-titulo"><Link to={'/inicio'}>TriviaTIP</Link></span>
				<div>
				<img src={usuario.img} alt=""/>
				<span className="header-nombre">{usuario.nombre} {usuario.apellido}</span>
				<span className="header-puntuacion">Puntuación: {usuario.puntaje} pts.</span>
				<a className="boton iniciar-sesion" onClick={this.cerrarSesion.bind(this)} >Cerrar Sesión</a>
				</div>
				</header>
				);
		}else if(url === '/iniciarSesion'){
			return  <header><span className="header-titulo"><Link to={'/inicio'}>TriviaTIP</Link></span><Link className="boton registrarse" to={`/registrarse`}>Registrarse</Link></header>;
		}else if(url === '/registrarse'){
			return  <header><span className="header-titulo"><Link to={'/inicio'}>TriviaTIP</Link></span><Link className="boton iniciar-sesion" to={`/iniciarSesion`}>Iniciar Sesión</Link></header>;
		}else{
			return  <header><span className="header-titulo"><Link to={'/inicio'}>TriviaTIP</Link></span><Link className="boton segundo iniciar-sesion" to={`/iniciarSesion`}>Iniciar Sesión</Link><Link className="boton registrarse" to={`/registrarse`}>Registrarse</Link></header>;	

		}
	}
}
export default Header;
