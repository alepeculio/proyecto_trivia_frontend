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
				cantPregs: categorias.length * preguntasPorCategoria,
			
			};
		}

		generarPreguntaDiaria ( posicion, categoria ) {
			let items = document.querySelectorAll( '#pdLista table tr' );
			items[posicion - 1].querySelector( '.pdEstado' ).innerHTML = 'Respondiendo...';
			items[posicion - 1].querySelector( '.pdEstado' ).removeAttribute( 'hidden' );
			items[posicion - 1].querySelector( '.pdResponder' ).setAttribute( 'hidden', true );


			let usuario_id = localStorage.getItem( 'usuario_id' );

			fetch( 'http://localhost:1234/preguntas/generarPreguntaDiaria', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json; charset=utf-8'
				},
				body: JSON.stringify( {
					ID_Usuario: usuario_id,
					categoria: categoria,
					posicion: posicion
				} )
			} ).then( res => {
				return res.json();
			} ).then( pregunta => {
				document.querySelector("#pdTabla").setAttribute( 'hidden', true );
				var b = <Pregunta
				funcion = { this.terminoResp.bind( this ) }
				pregunta = {pregunta.pregunta}
				correcta = {pregunta.respuestas[0]}
				respuesta1 = {pregunta.respuestas[0]}
				respuesta2 = {pregunta.respuestas[1]}
				respuesta3 = {pregunta.respuestas[2]}
				respuesta4 = {pregunta.respuestas[3]}
				id_Pregunta = {pregunta._id}
				mostrar = {true}
				/>
				this.setState({pregunta: b});
			} ).catch( err => {
				console.log( err );
			} );
		}

		componentWillMount() {
			this.cargarPreguntasDiarias();
		}

		aumentarPuntuacion() {
			let pts = document.querySelector( ".header-titulo .puntuacion" );
			let str = pts.innerHTML.split( " " );
			let nuevo = parseInt( str[1] ) + 1;
			pts.innerHTML = "Puntuación: " + nuevo + " pts.";
		}

		cargarPreguntasDiarias () {
			let usuario_id = localStorage.getItem( 'usuario_id' );

			fetch( 'http://localhost:1234/preguntas/preguntasDiarias?ID_Usuario=' + usuario_id, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json; charset=utf-8'
				}
			} ).then( res => {
				return res.json();
			} ).then( preguntas => {
				this.setState({pregunta: null});
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

		terminoResp() {
			document.querySelector("#pdTabla").removeAttribute( 'hidden' );
			this.cargarPreguntasDiarias();


		}


		render () {
			if ( this.props.usuario === "cargando" )
				return null;
			else if ( this.props.usuario.tipo === undefined || this.props.usuario.tipo === "SinSuscripcion" ) {
				return(
					<div id="pdLista">
						Solicite una suscripcion
					</div>
				);
			} else {
				return (
					<div id="pdLista">
					{this.state.pregunta}
					<table id="pdTabla" >
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
				}
			};


			export default PreguntasDiarias;

