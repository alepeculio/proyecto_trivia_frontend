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
    <Header usuario = { usuario } cerrarSesion = { this.cerrarSesion.bind( this ) } />

    <Route exact path="/" render={() => <Redirect to='/inicio' />} />
    <Route exact path="/inicio" component = { RankingUsuarios } />
    
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

    <Route path = "/ranking" component = { MenuInicial } />
    <Route path = "/preguntas" component = { MenuInicial } />
    <Route path = "/manoamano" component = { MenuInicial } />

    <Route path = "/ranking" render = { ( props ) => {
      if ( usuario === '' )
        return ( <Redirect to='/inicio' /> );
      else{
        this.pestania( "linkRanking" );
        return ( <RankingUsuarios /> );
      }
    } } />

    <Route path = "/preguntas" render = { ( props ) => {
      if ( usuario === '' )
        return ( <Redirect to='/inicio' /> );
      else {
        this.pestania( "linkPreguntas" );
        return ( <PreguntasDiarias /> );
      }
    } } />

    <Route path = "/manoamano" render = { ( props ) => {
      if ( usuario === '' )
        return ( <Redirect to='/inicio' /> );
      else {
        this.pestania( "linkManoAMano" );
        return ( <PreguntasDiarias /> );
      }
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
    <Link to = '/ranking' id="linkRanking">Ranking</Link>
    <Link to = '/preguntas' id="linkPreguntas">Preguntas diarias</Link>
    <Link to = '/manoamano' id="linkManoAMano">Mano a mano</Link>
    </div>
    </div>
    );
};

export default App;

