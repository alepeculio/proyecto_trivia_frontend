import React, { Component } from 'react';
import { Link, withRouter} from "react-router-dom";
import './Header.css';
import ReactResizeDetector from 'react-resize-detector';

class Header extends Component {
	constructor(){
		super();
		this.state = {};
	}

	cerrarSesion(){
		this.props.cerrarSesion();
	}

	hamburguesa(e) {
		e.preventDefault();
		e.target.classList.toggle("change");

		if(document.querySelector("header .no-logueado") !== null){
			document.querySelector("header .no-logueado").classList.toggle('mostrar');	
		}else{
			document.querySelector("header .logueado").classList.toggle('mostrar');
		}
	}

	onResize = () => {
		if ( window.innerWidth >= 661 ) {
			if ( document.querySelector( '.logueado' ) ) {
				document.querySelector( '.logueado' ).classList.remove( 'mostrar' );
			}
		}
	}
	
	render(){
		let usuario = this.props.usuario;
		let url = this.props.location.pathname;
		let btnIniciarSesion = <Link className="boton iniciar-sesion" to={`/iniciarSesion`}>Iniciar Sesión</Link>;
		let btnRegistrarse = <Link className="boton registrarse" to={`/registrarse`}>Registrarse</Link>;
		let titulo;
		let hamburguesa = 	<div className="hamburguesa" onClick={this.hamburguesa.bind(this)} >
								<div className="bar1"></div>
								<div className="bar2"></div>
								<div className="bar3"></div>
							</div>;


		if(usuario === ''){
			titulo =<Link className='header-titulo'  title='Ir a inicio' to={'/inicio'}><img src={require('./logo.png')} alt='logo'/></Link>;
			if(url === '/iniciarSesion'){
				return  <header>{titulo}<div className="no-logueado expandir">{btnRegistrarse}</div>{hamburguesa}</header>;
			}else if(url === '/registrarse'){
				return  <header>{titulo}<div className="no-logueado expandir">{btnIniciarSesion}</div>{hamburguesa}</header>;
			}else{
				return  <header>{titulo}<div className="no-logueado expandir"><Link className="boton segundo iniciar-sesion admin" to={`/iniciarSesion`}>Iniciar Sesión</Link>{btnRegistrarse}</div>{hamburguesa}</header>;	
			}	
		}else if(usuario === 'cargando'){
			return  <header>{titulo}<span className='boton cargando'>Cargando...</span></header>;	
		}else{
			titulo = <Link className='header-titulo'  title='Ir al ranking' to={'/ranking'}><img src={require('./logo.png')} alt='logo'/></Link>;
			/*if(document.querySelector(".hamburguesa") !== null)
			document.querySelector(".hamburguesa").classList.toggle("change");
			if(document.querySelector("header .logueado") !== null)
				document.querySelector("header .logueado").classList.toggle('mostrar');*/

			let clasessAdmins = "logueado expandir";
			let puntuacion;
			let pestanias;
			if(usuario.tipo !== 'Admin'){
				puntuacion = <span className="puntuacion">Puntuación: {usuario.puntaje} pts.</span>;
				pestanias = <div className = "links-container">
					<Link to = '/ranking' className = { this.props.history.location.pathname !== "/ranking" ? "header-link" : "header-link activo" } id = "linkRanking">Top 10</Link>
					<Link to = '/preguntas' className = { this.props.history.location.pathname !== "/preguntas" ? "header-link" : "header-link activo" } id = "linkPreguntas">Preguntas Diarias</Link>
					<Link to = '/duelos' className = { this.props.history.location.pathname !== "/duelos" ? "header-link" : "header-link activo" } id = "linkDuelos">Duelos</Link>
					<Link to = '/usuarios' className = { this.props.history.location.pathname !== "/usuarios" ? "header-link" : "header-link activo" } id = "linkUsuarios">Usuarios</Link>
				</div>;
			} else
				clasessAdmins += " admin";


			return(
				<header>
				<ReactResizeDetector handleWidth handleHeight onResize={this.onResize} />
				{titulo}
				<div className={clasessAdmins}>
					<img className="imagen" src={usuario.img} alt=""/>
					<span className="nombre"><Link title="Ver mi perfil" to="/perfil">{usuario.nombre} {usuario.apellido}</Link></span>
					{puntuacion}
					{pestanias}
					<a className="boton iniciar-sesion" onClick={this.cerrarSesion.bind(this)} >Cerrar Sesión</a>
				</div>
				{hamburguesa}

				
				</header>
				);
		}
	}
	
}
export default withRouter( Header );
