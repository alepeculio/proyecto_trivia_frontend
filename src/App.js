import React, { Component } from 'react';
import './App.css';
import ObtenerUsuarios from './ObtenerUsuarios';
import RegistrarUsuarioForm from './RegistrarUsuarioForm';
import IniciarSesionForm from './IniciarSesionForm';

class App extends Component {
  constructor(){
    super();
    this.state = {
      mensaje:false
    }
  }

  componentDidMount(){
    this.iniciarSesion();
  }

  iniciarSesion(usuario){
    if(usuario === undefined || usuario === null){
      let u = sessionStorage.getItem('usuario');
      if(u !== undefined && u !== null){
        this.setState({
          usuario: JSON.parse(u),
          registrarse: false,
          iniciarSesion: false
        });
      }else{
        this.setState({
          usuario: undefined,
          registrarse: false,
          iniciarSesion: true
        });
      }
    }else{
      this.setState({
        usuario:usuario,
        registrarse: false,
        iniciarSesion: false,
        mensaje:false
      });
      sessionStorage.setItem('usuario',JSON.stringify(usuario));
    }
  }

  cerrarSesion(){
    this.setState({
      usuario:undefined,
      registrarse: false,
      iniciarSesion: true
    });
    sessionStorage.removeItem('usuario');
  }

  registradoOk(){
    this.setState({
      mensaje: 'Bienvenido, inicia sesión para continuar'
    });
    this.mostrarIniciarSesion();
  }

  mostrarRegistrarse(){
    this.setState({
      registrarse: true,
      iniciarSesion: false
    }); 
  }

  mostrarIniciarSesion(){
    this.setState({
      registrarse: false,
      iniciarSesion: true
    }); 
  }

  render() {
    let estaLogueado = this.state.usuario !== undefined
    let contenidoHeader;
    let iniciarSesionForm;
    let registrarUsuarioForm;
    let mensaje = '';

    if(estaLogueado){
      contenidoHeader =<div>
      <img src={this.state.usuario.img} alt=""/>
      <span className="header-nombre">{this.state.usuario.nombre} {this.state.usuario.apellido}</span>
      <span className="header-puntuacion">Puntuación: {this.state.usuario.puntaje} pts.</span>
      <button onClick = {this.cerrarSesion.bind(this)}>Cerrar Sesión</button>
      </div>;
      iniciarSesionForm = '';
      registrarUsuarioForm = '';
    }

    if(this.state.registrarse){
      registrarUsuarioForm =  <RegistrarUsuarioForm registradoOk = {this.registradoOk.bind(this)}/>
      iniciarSesionForm = '';
      contenidoHeader = <div><button onClick = {this.mostrarIniciarSesion.bind(this)}>Iniciar Sesión</button></div>
    }

    if(this.state.iniciarSesion){
      registrarUsuarioForm =  '';
      iniciarSesionForm = <IniciarSesionForm iniciarSesion = {this.iniciarSesion.bind(this)}/>
      contenidoHeader = <div><button onClick = {this.mostrarRegistrarse.bind(this)}>Registrarse</button></div>
    }

    if(this.state.mensaje){
      mensaje = <span>{this.state.mensaje}</span>
    }

    return (
      <div className="App">
      <header>
      {contenidoHeader}
      </header>
      <h2>{mensaje}</h2>
      {iniciarSesionForm}
      {registrarUsuarioForm}
      <ObtenerUsuarios/>
      </div>
      );
  }
}

export default App;
