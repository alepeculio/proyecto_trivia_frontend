import React, { Component } from 'react';
import './App.css';
import RankingUsuarios from './RankingUsuarios';
import RegistrarUsuarioForm from './RegistrarUsuarioForm';
import IniciarSesionForm from './IniciarSesionForm';
import PreguntasDiarias from './PreguntasDiarias';
import Header from './Header';
import Mensaje from './Mensaje';

class App extends Component {
  constructor(){
    super();
    this.state = {};
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
        this.setState({usuario: undefined});
        this.mostrarIniciarSesion();
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
    this.setState({usuario:undefined});
    sessionStorage.removeItem('usuario');
    this.mostrarIniciarSesion();
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


   return (
    <div>
    {header}
    <Mensaje mensaje = {this.state.mensaje}/>
    {iniciarSesionForm}
    {registrarUsuarioForm}
    {preguntasDiarias}
    <RankingUsuarios/>
    </div>
    );
  }
}


export default App;

