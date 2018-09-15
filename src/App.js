import React, { Component } from 'react';
import './App.css';
//import Usuario from './Usuario';
import ObtenerUsuarios from './ObtenerUsuarios';


class App extends Component {
  constructor(){
    super();
    this.state = {}
  }


  render() {
    return (
      <div className="App">
        <ObtenerUsuarios/>
      </div>
      );
    }
  }

  export default App;
