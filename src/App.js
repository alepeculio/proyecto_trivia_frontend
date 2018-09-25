import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Redirect, Link } from "react-router-dom";
import Header from './Header';
import IniciarSesionForm from './IniciarSesionForm';
import RegistrarUsuarioForm from './RegistrarUsuarioForm';
import RankingUsuarios from './RankingUsuarios';
import PreguntasDiarias from './PreguntasDiarias';
import Mensaje from './Mensaje';

class App extends Component {
  constructor(){
    super();
    this.state = {
      usuario:''
    };
  }

  //Si ya habia un usuario logueado, obtenerlo con la id y setearlo en el estado.
  componentWillMount(){
   let usuario = localStorage.getItem('usuario_logueado');
   if(usuario !== null && usuario !== undefined){
    this.setState({usuario:'cargando'});
    fetch('http://localhost:1234/usuarios/obtener?id='+usuario,{
      method: 'GET',
      headers:{
        'Content-Type': 'application/json; charset=utf-8'
      },
    })
    .then(response => {
      return response.json();
    })
    .then(data => {
      if(data.Error !== undefined){
        console.log(data.Error);
      }else if(data.Mensaje !== undefined){
        console.log(data.Mensaje);
      }else{
       this.setState({usuario:data});
     }})
    .catch(err => {
      console.log(err);
    });
  }
}

//Se llama desde el componente IniciarSesionForm si se inicio correctamente.
iniciarSesion(usuario){
  localStorage.setItem('usuario_logueado', usuario.id);
  this.setState({usuario:usuario});
}

//Se llama desde el componente Header desde el boton cerrar sesion.
cerrarSesion(){
  localStorage.removeItem('usuario_logueado');
  this.setState({usuario:''});
}

render(){
  let usuario = this.state.usuario;
  return(
    <div>
    <Router>
    <div>
    <Route exact path="/" render={() => <Redirect to='/inicio' />} />
    <Route path="/inicio" render={(props) => <Inicio usuario={usuario} cerrarSesion={this.cerrarSesion.bind(this)} {...props} /> } />
    <Route path="/iniciarSesion" render={(props) => <IniciarSesion usuario={usuario} iniciarSesion={this.iniciarSesion.bind(this)} {...props} /> } />
    <Route path="/registrarse" render={(props) => <Registrarse usuario={usuario} {...props} /> } />

    <Route path = "/inicio/ranking" component = { RankingUsuarios } />
    <Route path = "/inicio/preguntas" component = { PreguntasDiarias } />

    </div>
    </Router>
    </div>
    );
}
}

const Inicio = (props) => {
  let usuario = props.usuario;

  let contenidoInicio
  if(usuario !== '' && usuario !== 'cargando'){
    if(true/*usuario.tipo === 'Suscripcion'*/){
      contenidoInicio = <MenuInicial />; //Agregar mas cosas para mostrar cuando hay un usuario logueado.    
    }else if(usuario.tipo === 'SinSuscripcion'){
      contenidoInicio = <div><Mensaje mensaje='No tienes una suscripcion vigente, obtén una para comenzar a responder preguntas.'/><RankingUsuarios/></div>
    }
  }
  return <div>
  <Header match = {props.match} usuario = {props.usuario} cerrarSesion={props.cerrarSesion}/>
  {contenidoInicio}
  </div>;
};

const IniciarSesion = (props) => {
  let mensaje;
  if(props.location.pathname === '/iniciarSesion/registro_ok'){
    mensaje = <Mensaje mensaje='Bienvenido, inicie sesión para continuar.'/>;
  }
  return <div>
  <Header match = {props.match} usuario = {props.usuario}/>
  {mensaje}
  <IniciarSesionForm iniciarSesion = {props.iniciarSesion} usuario = {props.usuario} {...props}/>
  </div>
};

const Registrarse = (props) => (
  <div>
  <Header match = {props.match} usuario = {props.usuario}/>
  <RegistrarUsuarioForm usuario={props.usuario}/>
  </div>
);

const MenuInicial = ( props ) => {
  return (
    <div id='menuInicial'>
      <div>
        <Link to = '/inicio/ranking'>Ranking</Link>
        <Link to = '/inicio/preguntas'>Preguntas diarias</Link>
        <Link to = '/inicio/manoamano'>Mano a mano</Link>
      </div>
    </div>
  );
};

export default App;

