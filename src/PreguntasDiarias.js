import React, { Component } from 'react';

class PreguntasDiarias extends Component {

	constructor () {
		super();

		let categorias = [
			[ 'Geografía', { color: 'white', backgroundColor: 'blue' } ],
			[ 'Historia', { color: 'white', backgroundColor: 'blue' } ],
			[ 'Deportes', { color: 'white', backgroundColor: 'blue' } ],
			[ 'Ciencia y Tecnología', { color: 'white', backgroundColor: 'blue' } ],
			[ 'Arte y Literatura', { color: 'white', backgroundColor: 'blue' } ],
			[ 'Entretenimiento', { color: 'white', backgroundColor: 'blue' } ]
		];

		let preguntas = [];
		let preguntasPorCategoria = 2;
		let pos = 1;

		for ( let i = 0; i < categorias.length; i++ )
			for ( let j = 0; j < preguntasPorCategoria; j++ ) {
				preguntas.push( {
					posicion: pos,
					categoria: categorias[i][0],
					estado: 'Nada',
					estilo: categorias[i][1]
				} );
				pos++;
			}

		this.state = {
			preguntas: preguntas
		};
	}

	generarPreguntaDiaria( posicion, categoria ) {
		//5b930d67dd0a701d6889bf98
		console.log( posicion + ", " + categoria );

		fetch( 'http://localhost:1234/preguntas/generarPreguntaDiaria', {
			method: 'POST',
			headers: {
  				'Content-Type': 'application/json; charset=utf-8'
			},
			body: JSON.stringify( {
				ID_Usuario: "5b930d67dd0a701d6889bf98",
				categoria: categoria,
				posicion: posicion
			} )
		} ).then( res => {
			console.log( res );
			return res.json();
		} ).then( pregunta => {
			console.log( pregunta );
		} ).catch( err => {
			console.log( err );
		} );
	}

	render () {
		return (
			<div id="pdLista">
				{ this.state.preguntas.map( p => {
					return (
						<div class="pdPregunta" style = { p.estilo }>
							<span class="pdPosicion">{ p.posicion }</span>
							<span>{ p.categoria }</span>
							<span class="pdEstado">{ p.estado }</span>
							<button onClick = { () => { this.generarPreguntaDiaria( p.posicion, p.categoria ); } }>Responder</button>
						</div>
					);
				} ) }
			</div>
		);
	}
};

export default PreguntasDiarias;