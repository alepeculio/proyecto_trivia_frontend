import React, { Component } from 'react';
import './App.css';
//import Usuario from './Usuario';
import ObtenerUsuarios from './ObtenerUsuarios';

import PreguntasDiarias from './PreguntasDiarias';


class App extends Component {
  constructor(){
    super();
    this.state = {}
  }


  render() {
    return (
      <div className="App">
        <ObtenerUsuarios/>
        <PreguntasDiarias />
      </div>
      );
    }
  }

  export default App;
