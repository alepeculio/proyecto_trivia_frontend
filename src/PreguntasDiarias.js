import React, { Component } from 'react';
import Pregunta from './Pregunta';
import './PreguntasDiarias.css';

class PreguntasDiarias extends Component {

	constructor () {
		super();
		let categorias = [
			[ 'Geografía', { color: 'white', backgroundColor: '#1575cf' } ],
			[ 'Historia', { color: 'white', backgroundColor: '#a6911b' } ],
			[ 'Deportes', { color: 'white', backgroundColor: '#ff9400' } ],
			[ 'Ciencia y Tecnología', { color: 'white', backgroundColor: '#008639' } ],
			[ 'Arte y Literatura', { color: 'white', backgroundColor: '#930309' } ],
			[ 'Entretenimiento', { color: 'white', backgroundColor: '#e643a0' } ]
		];

		let preguntas = [];
		let preguntasPorCategoria = 2;
		let pos = 1;

		for ( let i = 0; i < categorias.length; i++ )
			for ( let j = 0; j < preguntasPorCategoria; j++ ) {
				preguntas.push( {
					posicion: pos,
					categoria: categorias[i][0],
					estado: 'Cargando...',
					estilo: categorias[i][1]
				} );
				pos++;
			}
		
		this.state = {
			preguntas: preguntas,
			cantPregs: categorias.length * preguntasPorCategoria
		};
	}

	generarPreguntaDiaria ( posicion, categoria ) {
		let items = document.querySelectorAll( '#pdLista table tr' );
		items[posicion - 1].querySelector( '.pdEstado' ).innerHTML = 'Respondiendo...';
		items[posicion - 1].querySelector( '.pdEstado' ).removeAttribute( 'hidden' );
		items[posicion - 1].querySelector( '.pdResponder' ).setAttribute( 'hidden', true );

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
			return res.json();
		} ).then( pregunta => {

			let a = pregunta.nueva.respuestas[0].split(",");

			var b = <Pregunta
			pregunta = {pregunta.nueva.pregunta}
			correcta = {a[0]}
			respuesta1 = {a[0]}
			respuesta2 = {a[1]}
			respuesta3 = {a[2]}
			respuesta4 = {a[3]}
			/>
			this.setState({pregunta: b});
			this.cargarPreguntasDiarias();
		} ).catch( err => {
			console.log( err );
		} );
	}

	componentDidMount () {
		this.cargarPreguntasDiarias();
	}

	cargarPreguntasDiarias () {
		fetch( 'http://localhost:1234/preguntas/preguntasDiarias?ID_Usuario=5b930d67dd0a701d6889bf98', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json; charset=utf-8'
			}
		} ).then( res => {
			return res.json();
		} ).then( preguntas => {
			let items = document.querySelectorAll( '#pdLista table tr' );

			for ( let i = 0; i < this.state.cantPregs; i++ ) {
				items[i].querySelector( '.pdEstado' ).removeAttribute( 'hidden' );
				items[i].querySelector( '.pdResponder' ).setAttribute( 'hidden', true );

				let pregEncontrada = false;

				for ( let j = 0; j < preguntas.length; j++ ) {
					if ( preguntas[j].posicion === i + 1 ) {
						let tdEstado = items[i].querySelector( '.pdEstado' );

						let estado = preguntas[j].estado === 'NoRespondio' ? 'Incorrecta' : preguntas[j].estado;
						tdEstado.innerHTML = estado;

						tdEstado.classList.remove( 'correcta' );
						tdEstado.classList.remove( 'incorrecta' );

						if ( estado === 'Correcta' )
							tdEstado.classList.add( 'correcta' );
						else if ( estado === 'Incorrecta' )
							tdEstado.classList.add( 'incorrecta' );

						pregEncontrada = true;
						preguntas.splice( j, 1 );
						break;
					}
				}

				if ( !pregEncontrada ) {
					items[i].querySelector( '.pdEstado' ).setAttribute( 'hidden', true );
					items[i].querySelector( '.pdResponder' ).removeAttribute( 'hidden' );
				}
			}
		} ).catch( err => {
			console.log( 'Error: ' + err );
		} );
	}

	render () {
		return (
			<div id="pdLista">
			{this.state.pregunta}
				<table>
					<tbody>
						{ this.state.preguntas.map( p => {
							return (
								<tr key={p.posicion}>
									<td>
										{ p.posicion }
									</td>
									<td style = { p.estilo }>
										{ p.categoria }
									</td>
									<td className="pdEstado">
										{ p.estado }
									</td>
									<td className="pdResponder" style = { p.estilo } hidden onClick = { () => { this.generarPreguntaDiaria( p.posicion, p.categoria ) } }>
										Responder
									</td>
								</tr>
							);
						} ) }
					</tbody>
				</table>
			</div>
		);
	}
};

export default PreguntasDiarias;