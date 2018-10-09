import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Redirect, Link } from "react-router-dom";
import Header from './Header';
import IniciarSesionForm from './IniciarSesionForm';
import RegistrarUsuarioForm from './RegistrarUsuarioForm';
import RankingUsuarios from './RankingUsuarios';
import PreguntasDiarias from './PreguntasDiarias';
import Mensaje from './Mensaje';
import Perfil from './Perfil';
import Suscripciones from './Suscripciones';

const meURL = 'http://localhost:1234/usuarios/authMe';

class App extends Component {
	constructor(){
		super();
		this.state = {
			usuario:''
		};
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

	//Si ya habia un usuario logueado, obtenerlo con la id y setearlo en el estado.
	componentWillMount(){
		this.obtenerUsuario();
	}

	//Se llama desde el componente IniciarSesionForm si se inicio correctamente.
	iniciarSesion(token, usuario){
		localStorage.setItem('usuario_logueado', token);
		localStorage.setItem( 'usuario_id', usuario.id );
		this.setState({usuario:usuario});
	}

	//Se llama desde el componente Header desde el boton cerrar sesion.
	cerrarSesion(){
		localStorage.removeItem('usuario_logueado');
		localStorage.removeItem('usuario_id');
		this.setState({usuario:''});
	}

	pestania( p ) {
		let ranking = document.querySelector( "#linkRanking" );
		let preguntas = document.querySelector( "#linkPreguntas" );
		let manoamano = document.querySelector( "#linkManoAMano" );

		if ( ranking ) {
			ranking.classList.remove( "activo" );

			if ( p === "linkRanking" )
				ranking.classList.add( "activo" );
		}

		if ( preguntas ) {
			preguntas.classList.remove( "activo" );

			if ( p === "linkPreguntas" )
				preguntas.classList.add( "activo" );
		}

		if ( manoamano ){
			manoamano.classList.remove( "activo" );

			if ( p === "linkManoAMano" )
				manoamano.classList.add( "activo" );
		}
	}

	render(){
		let usuario = this.state.usuario;
		return(
			<div>
			<Router>
			<div>
			<Header usuario = { usuario } cerrarSesion = { this.cerrarSesion.bind( this ) } />

			<Route exact path="/" render={() => {
				if(usuario === 'cargando')
					return null;
				else if(usuario === '')
					return <Redirect to='/inicio' />;
				else
					return <Redirect to='/ranking' />;
			}} />
			<Route exact path="/inicio" component = { () => {
				let usuario = localStorage.getItem('usuario_logueado');
				if(usuario !== null && usuario !== undefined){
					return ( <Redirect to='/ranking' /> );
				} else
				return ( <div className = "padre"> <div className = "contenedor2"> <RankingUsuarios /> </div> </div> );
			} } />

			<Route path="/iniciarSesion" render={ (props) => {
				let mensaje;
				if(props.location.pathname === '/iniciarSesion/registro_ok')
					mensaje = <Mensaje mensaje='Bienvenido, inicie sesión para continuar.'/>;

				return (<div>
					{mensaje}
					<IniciarSesionForm iniciarSesion = {this.iniciarSesion.bind(this)} usuario = {usuario}/>
					</div>);
				}} />

				<Route path="/registrarse" render={ (props) => <RegistrarUsuarioForm usuario = { usuario } /> } />

				<Route path = "/ranking" render = { ( props ) => {
					if ( usuario === '' )
						return ( <Redirect to='/inicio' /> );
					else if(usuario.tipo === 'Admin')
						return <Redirect to='/admin' />
					else
						return ( <div className = "padre"> <div className = "contenedor"> <MenuInicial link = { "linkRanking" } /> <RankingUsuarios /> </div> </div> );
				} } />

				<Route path = "/preguntas" render = { ( props ) => {
					if ( usuario === '' )
						return ( <Redirect to='/inicio' /> );
					else
						return ( <div className = "padre"> <div className = "contenedor"> <MenuInicial link = { "linkPreguntas" } /> <PreguntasDiarias /> </div> </div> );
				} } />

				<Route path = "/manoamano" render = { ( props ) => {
					if ( usuario === '' )
						return ( <Redirect to='/inicio' /> );
					else
						return ( <div className = "padre"> <div className = "contenedor"> <MenuInicial link = { "linkManoAMano" } /> <PreguntasDiarias /> </div> </div> );
				} } />

				<Route path = "/perfil" render = { ( props ) => {
					if(usuario === 'cargando')
						return null;
					else if(usuario === '')
						return <Perfil usuario = '' />;
					else
						return <Perfil usuario={usuario} />;

				} } />

				<Route path = "/admin" render = { (props) => {
					if(usuario === 'cargando')
						return null;
					else if(usuario !== '' && usuario.tipo === 'Admin')
						return <Suscripciones />;
					else
						return  <Redirect to='/inicio' />;

				} } />
				</div>
				</Router>
				</div>
				);
			}
		}

		const MenuInicial = ( props ) => {
			return (
				<div id='menuInicial'>
				<div>
				<Link to = '/ranking' id="linkRanking" className = { props.link === "linkRanking" ? "activo" : "" }>Ranking</Link>
				<Link to = '/preguntas' id="linkPreguntas" className = { props.link === "linkPreguntas" ? "activo" : "" }>Preguntas diarias</Link>
				<Link to = '/manoamano' id="linkManoAMano" className = { props.link === "linkManoAMano" ? "activo" : "" }>Mano a mano</Link>
				</div>
				</div>
				);
			};

			export default App;

