import React, { Component } from 'react';
import './App.css';
import RankingUsuarios from './RankingUsuarios';
import RegistrarUsuarioForm from './RegistrarUsuarioForm';
import IniciarSesionForm from './IniciarSesionForm';
import PreguntasDiarias from './PreguntasDiarias';
import Header from './Header';

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
    let header;
    let mensaje = '';
    let iniciarSesionForm;
    let registrarUsuarioForm;
    let preguntasDiarias;


    if(estaLogueado){
      header = <Header usuario={this.state.usuario} cerrarSesion={this.cerrarSesion.bind(this)}/>;
      iniciarSesionForm = '';
      registrarUsuarioForm = '';
      preguntasDiarias = <PreguntasDiarias/>;
    }

    if(this.state.registrarse){
      header = <Header iniciarSesion={this.mostrarIniciarSesion.bind(this)}/>;
      iniciarSesionForm = '';
      registrarUsuarioForm =  <RegistrarUsuarioForm registradoOk = {this.registradoOk.bind(this)}/>;
    }

    if(this.state.iniciarSesion){
     header = <Header registrarse={this.mostrarRegistrarse.bind(this)}/>;
     iniciarSesionForm = <IniciarSesionForm iniciarSesion = {this.iniciarSesion.bind(this)}/>;
     registrarUsuarioForm =  '';
   }

   if(this.state.mensaje){
    mensaje = <span>{this.state.mensaje}</span>
  }

  return (
    <div>
    {header}
    <h2>{mensaje}</h2>
    {iniciarSesionForm}
    {registrarUsuarioForm}
    <RankingUsuarios/>
    {preguntasDiarias}
    </div>
    );
}
}


export default App;

