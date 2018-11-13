/* eslint-disable */
import React, { Component } from 'react';
import openSocket from 'socket.io-client';
import './App.css';
import { BrowserRouter as Router, Route, Redirect, Link } from "react-router-dom";
import Header from './Header';
import IniciarSesionForm from './IniciarSesionForm';
import RegistrarUsuarioForm from './RegistrarUsuarioForm';
import RankingUsuarios from './RankingUsuarios';
import PreguntasDiarias from './PreguntasDiarias';
import Mensaje from './Mensaje';
import Perfil from './Perfil';
import Duelos from './Duelos';

import UsuariosListado from './UsuariosListado';
import Suscripciones from './Suscripciones';
import Preguntas from './Preguntas';
import Mensajes from './Mensajes';

import {properties} from './properties.js'

const meURL = properties.ip+properties.puerto+'/usuarios/authMe';
const socket = openSocket(properties.ip+properties.socket);

class App extends Component {
	constructor(){
		super();
		this.state = {
			usuario:''
		};
		this.mensajes = React.createRef();

		socket.on( 'mensaje', ( mensaje ) => {
			if ( this.mensajes !== undefined ) {
				this.mensajes.current.agregarMensaje( mensaje );

				if ( mensaje.puntos !== undefined )
					this.aumentarPuntuacion( mensaje.puntos );
			}
		} );

		socket.on( 'ranking', ( rank ) => {
			let usuarios = document.querySelectorAll( '.usuarios_ranking .usuario' );

			// TODO: Quedan bugs por arreglar!
			if ( usuarios.length > 0 )
				for ( let i = 0; i < rank.length; i++ ) {
					usuarios[i].querySelector( '.nombre' ).innerHTML = rank[i].nombre;
					usuarios[i].querySelector( '.puntaje' ).innerHTML = rank[i].puntaje;
				}
		} );

		socket.on( 'nuevo-ranking', ( ranking ) => {
			for ( let i = 0; i < ranking.length; i++ )
				console.log( ranking[i].nombre + ' ' + ranking[i].puntaje );

			let usus = document.querySelectorAll( '.usuarios_ranking .usuario' );
			if ( usus.length > 0 ) {
				let i;

				for ( i = 0; i < ranking.length; i++ ) {
					if ( usus[i] === undefined ) {
						let copia = usus[i - 1].cloneNode( true );
						document.querySelector( '.usuarios_ranking' ).appendChild( copia );
						usus = document.querySelectorAll( '.usuarios_ranking .usuario' );
					}

					let medalla = usus[i].querySelector( '.medalla' );

					if ( medalla !== undefined && medalla !== null ) {
						if ( i == 0 ) {
							medalla.src = require( './medalla-de-oro.png' );
							medalla.style.display = 'inline-block';
						} else if ( i == 1 ) {
							medalla.src = require( './medalla-de-plata.png' );
							medalla.style.display = 'inline-block';
						} else if ( i == 2 ) {
							medalla.src = require( './medalla-de-bronce.png' );
							medalla.style.display = 'inline-block';
						} else {
							medalla.style.display = 'none';
						}
					}

					usus[i].href = '/perfil/' + ranking[i].correo;
					usus[i].querySelector( 'img' ).src = ranking[i].img;
					usus[i].querySelector( '.nombre' ).innerHTML = ranking[i].nombre + ' ' + ranking[i].apellido;
					usus[i].querySelector( '.puntaje' ).innerHTML = ranking[i].puntaje + ' pts.';
				}

				while ( i < usus.length ) {
					usus[i].remove();
					i++;
				}
			}
		} );

		socket.on( 'desconectar', () => {
			alert( 'Conexión detectada desde otro dispositivo, desconectando...' );
			this.cerrarSesion();
		} );
	}

	dueloAceptado ( retador, retado ) {
		socket.emit( 'duelo-aceptado', retador, retado );
	}

	dueloFinalizado ( correctas, tiempo, retador, retado ) {
		socket.emit( 'duelo-finalizado', correctas, tiempo, retador, retado );
	}

	ocultarCoso() {
		let ocultar = document.querySelector( 'header .expandir' );

		if ( ocultar !== undefined && ocultar !== null ) {
			ocultar.classList.remove( 'mostrar' );
		}
	}

	mostrarMensaje( titulo, mensaje ) {
		if ( this.mensajes != undefined )
			this.mensajes.current.agregarMensaje( {
				titulo: titulo,
				conetenido: contenido
			} );
	}

	obtenerUsuario(){
		let usuario = localStorage.getItem('usuario_logueado');
		if(usuario !== null && usuario !== undefined){
			this.setState({usuario:'cargando'});
			fetch( meURL, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json; charset=utf-8',
					'x-access-token': usuario
				}
			} )
			.then( response => {
				return response.json();
			} )
			.then( data => {
				this.iniciarSesion(usuario, data);
  				//this.setState({usuario:data});
  			} )
			.catch( err => {
				console.log( err );
				console.log('Reintentando...');
				setTimeout( this.obtenerUsuario.bind(this) , 10000);
			} );
		}
	}

	aumentarPuntuacion( puntos ) {
		let pts = document.querySelector( "header .logueado .puntuacion" );
		if ( pts === null )
			return;
		let str = pts.innerHTML.split( " " );
		let nuevo = parseInt( str[1] ) + puntos;
		pts.innerHTML = "Puntuación: " + nuevo + " pts.";
	}

	//Si ya habia un usuario logueado, obtenerlo con la id y setearlo en el estado.
	componentWillMount(){
		this.obtenerUsuario();
	}

	//Se llama desde el componente IniciarSesionForm si se inicio correctamente.
	iniciarSesion(token, usuario){
		localStorage.setItem('usuario_logueado', token);
		localStorage.setItem( 'usuario_id', usuario.id );
		this.setState({usuario:usuario});

		socket.emit( 'conectado', usuario.id );
	}

	//Se llama desde el componente Header desde el boton cerrar sesion.
	cerrarSesion(){
		localStorage.removeItem('usuario_logueado');
		localStorage.removeItem('usuario_id');
		this.setState({usuario:''});

		socket.emit( 'desconectar' );
	}

	render(){
		let usuario = this.state.usuario;
		return(
			<div>
			<Router>
			<div>
			<Header usuario = { usuario } cerrarSesion = { this.cerrarSesion.bind( this ) } />

			<Route exact path="/" render={() => {
				this.ocultarCoso();
				socket.emit( 'unsub-ranking' );
				if(usuario === 'cargando')
					return null;
				else if(usuario === '')
					return <Redirect to='/inicio' />;
				else
					return <Redirect to='/ranking' />;
			}} />
			<Route exact path="/inicio" component = { () => {
				this.ocultarCoso();
				socket.emit( 'sub-ranking' );
				let usuario = localStorage.getItem('usuario_logueado');
				if(usuario !== null && usuario !== undefined){
					return ( <Redirect to='/ranking' /> );
				} else
				return ( <div className = "padre"> <div className = "contenedor3"> <RankingUsuarios /> </div> </div> );
			} } />

			<Route path="/iniciarSesion" render={ (props) => {
				this.ocultarCoso();
				socket.emit( 'unsub-ranking' );
				let mensaje;
				if(props.location.pathname === '/iniciarSesion/registro_ok')
					mensaje = <Mensaje mensaje='Bienvenido, inicie sesión para continuar.'/>;

				return (<div>
					{mensaje}
					<IniciarSesionForm iniciarSesion = {this.iniciarSesion.bind(this)} usuario = {usuario}/>
					</div>);
			}} />

			<Route path="/registrarse" render={ (props) => {
				this.ocultarCoso();
				socket.emit( 'unsub-ranking' );
				return ( <RegistrarUsuarioForm usuario = { usuario } /> );
			} } />

			<Route path = "/ranking" render = { ( props ) => {
				this.ocultarCoso();
				socket.emit( 'sub-ranking' );
				if ( usuario === '' )
					return ( <Redirect to='/inicio' /> );
				else if(usuario.tipo === 'Admin')
					return <Redirect to='/admin' />
				else
					return ( <div className = "padre"> <div className = "contenedor"> <RankingUsuarios /> </div> </div> );
			} } />

			<Route path = "/preguntas" render = { ( props ) => {
				this.ocultarCoso();
				socket.emit( 'unsub-ranking' );
				if ( usuario === '' )
					return ( <Redirect to='/inicio' /> );
				else if(usuario.tipo === 'Admin')
					return <Redirect to='/admin' />
				else
					return ( <div className = "padre"> <div className = "contenedor"> <PreguntasDiarias usuario = { usuario } /> </div> </div> );
			} } />

			<Route path = "/duelos" render = { ( props ) => {
				this.ocultarCoso();
				socket.emit( 'unsub-ranking' );
				if ( usuario === '' )
					return ( <Redirect to='/inicio' /> );
				else if(usuario.tipo === 'Admin')
					return <Redirect to='/admin' />
				else
					return ( <div className = "padre"> <div className = "contenedor"> <Duelos usuario = { usuario } dueloAceptado = { this.dueloAceptado.bind( this ) } dueloFinalizado = { this.dueloFinalizado.bind( this ) } /> </div> </div> );
			} } />
			<Route path = "/usuarios" render = { ( props ) => {
				this.ocultarCoso();
				socket.emit( 'unsub-ranking' );
				if ( usuario === '' )
					return ( <Redirect to='/inicio' /> );
				else if(usuario.tipo === 'Admin')
					return <Redirect to='/admin' />
				else
					return ( <div className = "padre"> <div className = "contenedor"> <UsuariosListado usuario = { usuario } /> </div> </div> );
			} } />

			<Route path = "/perfil" render = { ( props ) => {
				this.ocultarCoso();
				socket.emit( 'unsub-ranking' );
				if(usuario === 'cargando')
					return null;
				else if(usuario === '')
					return <Perfil usuario = '' />;
				else
					return <Perfil usuario={usuario} />;

			} } />

			<Route path = "/admin" render = { (props) => {
				socket.emit( 'unsub-ranking' );
				if(usuario === 'cargando')
					return null;
				else if(usuario !== '' && usuario.tipo === 'Admin')
					return <div className="menu-admin"><Suscripciones usuario={usuario} /><Preguntas /> <div className="btnResetear"><button onClick={this.resetear.bind(this)}>Resetear</button></div></div>;
				else
					return  <Redirect to='/inicio' />;

			} } />
			<Mensajes ref = { this.mensajes }/>
			</div>
			</Router>
			</div>
			);
	}

	resetear(e){
		let usuario = this.state.usuario;
		console.log( usuario );
		if(window.confirm('¿Está seguro de que desea eliminar las preguntas respondidas y mano a mano?')){
			fetch( properties.ip+properties.puerto+'/usuarios/reset', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json; charset=utf-8'
				},
				body: JSON.stringify( {
					correo: usuario.correo,
					id: usuario.id
				} )
			} ).then( res => {
				if(res.statusText === 'OK')
					alert('Datos eliminados');
				else
					alert('Falla al eliminar los datos');
			} ).catch( err => {
				console.log(err);
				alert('Hubo un error al eliminar los datos')
			});
		}
	
	}
}

/*const MenuInicial = ( props ) => {
	return (
		<div id='menuInicial'>
		<div>
		<Link to = '/ranking' id="linkRanking" className = { props.link === "linkRanking" ? "activo" : "" }>Ranking</Link>
		<Link to = '/preguntas' id="linkPreguntas" className = { props.link === "linkPreguntas" ? "activo" : "" }>Preguntas diarias</Link>
		<Link to = '/manoamano' id="linkManoAMano" className = { props.link === "linkManoAMano" ? "activo" : "" }>Duelos</Link>
		<Link to = '/usuarioListado' id="linkUsuarioListado" className = { props.link === "linkUsuarioListado" ? "activo" : "" }>Usuarios</Link>
		</div>
		</div>
		);
	};*/

	export default App;

