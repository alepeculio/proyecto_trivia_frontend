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
      usuario:''
    };
  }

  componentWillMount(){
   let usuario = localStorage.getItem('usuario');
   if(usuario !== null && usuario !== undefined){
    this.setState({usuario:JSON.parse(usuario)});
  }else{
    this.setState({usuario: ''});
  }
}

iniciarSesion(usuario){
  localStorage.setItem('usuario', JSON.stringify(usuario));
  this.setState({usuario:usuario});
}

cerrarSesion(){
  localStorage.removeItem('usuario');
  this.setState({usuario:''});
}

render(){
  let usuario = this.state.usuario;
  return(
    <div>
    <Router>
    <div>
    <Route exact path="/" render={(props) => <Inicio  {...props}  usuario={usuario}  cerrarSesion={this.cerrarSesion.bind(this)} /> } />
    <Route path="/inicio" render={(props) => <Inicio  {...props}  usuario={usuario}  cerrarSesion={this.cerrarSesion.bind(this)} /> } />
    <Route path="/iniciarSesion" render={(props) => <IniciarSesion  {...props}  usuario={usuario} iniciarSesion={this.iniciarSesion.bind(this)}/> } />
    <Route path="/registrarse" render={(props) => <Registrarse  {...props}  usuario={usuario} /> } />
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

