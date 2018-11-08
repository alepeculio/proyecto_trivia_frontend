/* eslint-disable */
import React, { Component } from 'react';
import './Mensajes.css';

// Esta clase no usa el render ni nada, esta para que quede separado y mas prolijo
class Mensajes extends Component {
	constructor () {
		super();

		// Los mensajes se acumulan aquí y se muestran como 'FIFO'
		this.mensajes = [];
	}

	agregarMensaje ( nuevoMensaje ) {
		// Seleccionar el mensaje recibido
		let msj = document.querySelector( '.mensajeRecibido' );

		// Si hay un mesaje mostrandose se guarda en el arreglo
		if ( msj !== null ) {
			this.mensajes.push( nuevoMensaje );
		} else {
			// De lo contrario se prepara el mensaje
			let cerrar = document.createElement( 'span' );
			cerrar.innerHTML = 'X';

			// Para cerrar el mensaje se llama a 'mensajeCerrado'
			cerrar.onclick = () => {
				this.mensajeCerrado();
			};

			let titulo = document.createElement( 'span' );
			titulo.innerHTML = nuevoMensaje.titulo;

			let div = document.createElement( 'div' );
			div.appendChild( titulo );
			div.appendChild( cerrar );

			let mensaje = document.createElement( 'div' );
			mensaje.innerHTML = nuevoMensaje.contenido;

			let msjRecibido = document.createElement( 'div' );
			msjRecibido.classList.add( 'mensajeRecibido' );

			msjRecibido.appendChild( div );
			msjRecibido.appendChild( mensaje );

			// Se agrega al DOM
			document.querySelector( 'body' ).appendChild( msjRecibido );
		}
	}

	mensajeCerrado () {
		// Se remueve el mensaje existente
		let msjActual = document.querySelector( '.mensajeRecibido' );

		if ( msjActual !== null )
			msjActual.remove();

		// Si quedan mensajes en el arreglo se agrega el último de la lista
		// la función shift remueve y devuelve el último elemento
		if ( this.mensajes.length != 0 )
			this.agregarMensaje( this.mensajes.shift() );
	}

	render () {
		return null;
	}
}

export default Mensajes;