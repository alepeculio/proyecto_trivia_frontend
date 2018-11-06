import React, { Component } from 'react';
import './Preguntas.css';
import {properties} from './properties.js'
const preguntasListaURL = properties.ip+properties.puerto+'/preguntas/obtenerPreguntas?cantidad=';
const editarPreguntaURL = properties.ip+properties.puerto+'/preguntas/editarPregunta';
const eliminarPreguntaURL = properties.ip+properties.puerto+'/preguntas/eliminarPregunta';


class Preguntas extends Component{
	constructor(){
		super();
		this.state = {
			preguntas: ''
		};
	}

	componentDidMount(){
		this.obtenerPreguntas("");
	}

	obtenerPreguntas(busqueda){
		fetch(preguntasListaURL+"100"+"&busqueda="+busqueda,{
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
				this.setState({preguntas: ''});
			}else if(data.Mensaje !== undefined){
				this.setState({preguntas: 'no hay'});
			}else{
				let preguntas = data.Preguntas.map(p => {
					let respuestas = p.respuestas.map( ( r, index ) =>{
						let key = r._id + " " + index;
						return <input key={key} disabled name={'respuesta'+index} className={index === 0 ? "respuesta correcta" : "respuesta"} defaultValue={r}/>;
					});
					
					return(
						<div key={p._id} className="pregunta">
						<form onSubmit={this.confirmar.bind(this)}>
						<textarea className="texto" defaultValue={p.pregunta} name="pregunta" disabled ></textarea>
						<img src={require('./expand.png')} alt='expandir'onClick={this.expandir.bind(this) } />
						<input hidden defaultValue={p._id} name="id" />
						<input hidden defaultValue={p.categoria._id} name="categoria" />
						<div className="respuestas">
						{respuestas}
						<div className="editar">
						<span className="mensaje"></span>
						<button className="btnConfirmar" hidden >Confirmar</button>
						<button type="button" className="btnEditar" onClick={this.editar.bind(this)}>Editar</button>
						<button className="eliminar" type="button" onClick={this.eliminar.bind(this)}>Eliminar</button>
						</div>
						</div>
						</form>
						</div>
						);
				});
				this.setState({preguntas: preguntas});
			}})
		.catch(err => {
			console.log(err);
			console.log('Reintentando...');
			setTimeout( this.obtenerPreguntas.bind(this) , 10000);
		});
	}

	expandir(e){
		if(e.target.parentNode.parentNode.classList.contains('pregunta'))
			e.target.parentNode.parentNode.querySelector('.mensaje').classList.remove('error');
		
		e.target.parentNode.parentNode.querySelector('.mensaje').classList.remove('correcto');
		e.target.parentNode.parentNode.querySelector('.respuestas').classList.toggle('mostrar');
		this.trufalse(true, e.target);
	}

	trufalse(tf, target) {
		let campos = target.parentNode.parentNode.parentNode.querySelectorAll('.pregunta input, .pregunta textarea');
		for(let c of campos){
			c.disabled = tf;
			if (tf)
				c.classList.remove('fb');
			else
				c.classList.add('fb');
		}
		target.parentNode.querySelector('.btnConfirmar').hidden = tf;
		target.parentNode.querySelector('.btnEditar').innerHTML = tf ? 'Editar' : 'Cancelar';
		if (tf)
			target.parentNode.querySelector('.btnEditar').classList.remove('cancelar');
		else
			target.parentNode.querySelector('.btnEditar').classList.add('cancelar');
	}

	editar(e){
		this.trufalse(e.target.classList.contains('cancelar'), e.target);
	}

	eliminar(e){
		let target = e.target;
		if(window.confirm('¿Está seguro de que desea eliminar la pregunta?, No se podrá recuperar.')){
			let id = target.parentNode.parentNode.parentNode.querySelector('input[name="id"]').value;
			fetch( eliminarPreguntaURL , {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json; charset=utf-8'
				},
				body: JSON.stringify( {
					id: id
				} )
			} ).then( res => {
				return res.json();
			}).then( data => {
				if(data.Mensaje !== undefined){
					target.parentNode.parentNode.parentNode.parentNode.hidden = true;	
				}else if(data.Error !== undefined){
					let mensaje = target.parentNode.querySelector('.mensaje');
					mensaje.innerHTML = 'Error al editar, reintente';
					mensaje.classList.add('error');
				}
			}).catch( err => {
				console.log(err);
			});
		}
	}

	confirmar(e){
		e.preventDefault();
		
		let id = e.target.id.value;
		let pregunta = e.target.pregunta.value;
		let correcta = e.target.respuesta0.value;
		let incorrecta1 = e.target.respuesta1.value;
		let incorrecta2 = e.target.respuesta2.value;
		let incorrecta3 = e.target.respuesta3.value;
		let categoria = e.target.categoria.value;

		let target = e.target;
		let btnConfirmar = e.target.querySelector('.btnConfirmar');
		btnConfirmar.disabled = true;
		//this.trufalse(true, event.target);

		fetch( editarPreguntaURL , {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json; charset=utf-8'
			},
			body: JSON.stringify( {
				id: id,
				pregunta: pregunta,
				correcta: correcta,
				incorrecta1: incorrecta1,
				incorrecta2: incorrecta2,
				incorrecta3: incorrecta3,
				categoria: categoria
			} )
		} ).then( res => {
			return res.json();
		}).then( data => {
			btnConfirmar.disabled = false;
			let mensaje = target.parentNode.querySelector('.mensaje');
			if(data.Mensaje !== undefined){
				this.trufalse(true, target);
				mensaje.innerHTML = 'Editada correctamente';
				mensaje.classList.add('correcto');
			}else if(data.Error !== undefined){
				mensaje.innerHTML = 'Error al editar, reintente';
				mensaje.classList.add('error');
			}
		}).catch( err => {
			console.log(err);
		});
	}


	/*obtenerColor(categoria){
		let color;
		switch(categoria){	
			case 'Geografía':
			color = '#1575cf';
			break;
			case 'Historia':
			color = '#a6911b';
			break;
			case 'Ciencia y Tecnología':
			color = '#008639';
			break;
			case 'Arte y Literatura':
			color = '#930309';
			break;
			case 'Entretenimiento':
			color = '#e643a0';
			break;
			case 'Deportes':
			color = '#ff9400';
			break;
			default:
			color = '';
			break;
		}
		return color;
	}*/

	buscar(e){
		e.preventDefault();
		this.setState({preguntas: ''});
		this.obtenerPreguntas(e.target.busqueda.value);
	}


	render(){
		let preguntas = this.state.preguntas;
		if(preguntas === '')
			preguntas =  <div className='cargando'>Cargando...</div>;

		if(preguntas == 'no hay')
			preguntas =  <div className='cargando no-hay'>No se encontraron preguntas.</div>;

		return (
			<div className='preguntas'>
			<span className='titulo'>
			<h3>Preguntas</h3>
			</span>
			<div className="contenedor">
			<div className="buscador">
			<form onSubmit={this.buscar.bind(this)}>
			<input name="busqueda" placeholder="Ingresa una pregunta..."/>
			<button>Buscar</button>
			</form>
			</div>
			{preguntas}
			</div>
			</div>);
	}
}

export default Preguntas;