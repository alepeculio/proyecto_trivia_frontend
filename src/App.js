import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route} from "react-router-dom";
import Header from './Header';
import IniciarSesionForm from './IniciarSesionForm';
import RegistrarUsuarioForm from './RegistrarUsuarioForm';
import RankingUsuarios from './RankingUsuarios';
//import PreguntasDiarias from './PreguntasDiarias';
//import Mensaje from './Mensaje';

class App extends Component {
  constructor(){
    super();
    this.state = {
      usuario:'cargando'
    };
  }

  //Si ya habia un usuario logueado, obtenerlo con la id y setearlo en el estado.
  componentWillMount(){
   let usuario = localStorage.getItem('usuario_logueado');
   if(usuario !== null && usuario !== undefined){
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
  }else{
    this.setState({usuario: ''});
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
    <Route exact path="/" render={(props) => <Inicio usuario={usuario} cerrarSesion={this.cerrarSesion.bind(this)} {...props} /> } />
    <Route path="/inicio" render={(props) => <Inicio usuario={usuario} cerrarSesion={this.cerrarSesion.bind(this)} {...props} /> } />
    <Route path="/iniciarSesion" render={(props) => <IniciarSesion usuario={usuario} iniciarSesion={this.iniciarSesion.bind(this)} {...props} /> } />
    <Route path="/registrarse" render={(props) => <Registrarse usuario={usuario} {...props} /> } />
    </div>
    </Router>
    </div>
    );
  }
}

const Inicio = (props) => (
<div>
<Header match = {props.match} usuario = {props.usuario} cerrarSesion={props.cerrarSesion}/>
<RankingUsuarios/>
</div>
);

const IniciarSesion = (props) => (
<div>
<Header match = {props.match} usuario = {props.usuario}/>
<IniciarSesionForm iniciarSesion={props.iniciarSesion}/>
</div>
);

const Registrarse = (props) => (
<div>
<Header match = {props.match} usuario = {props.usuario}/>
<RegistrarUsuarioForm/>
</div>
);

export default App;

