import React, { Component } from 'react';
import Usuario from './Usuario';

class ObtenerUsuarios extends Component{
	constructor(){
		super();
		this.state = {
			usuarios:[]
		};
	}

	componentDidMount(){
		fetch('http://localhost:1234/usuarios/listar',{
  			method: 'GET',
  			headers:{
  				'Content-Type': 'application/json; charset=utf-8'
  			},
		})
		.then(response => {
			return response.json();
		})
		.then(data => {
			console.log(data.usuarios);
			let usuarios = data.usuarios.map(u => {
				return(
						<Usuario
							id = {u.id}
							img = {u.img}
							correo = {u.correo}
							nombre = {u.nombre}
							apellido = {u.apellido}
							pass = {u.pass}
							tipo = {u.tipo}
							mmrestantes = {u.mmrestantes}
							puntaje = {u.puntaje}
						/>
					);
				})
			this.setState({usuarios: usuarios});
		})
		.catch(err => {
			console.log(err);
		});
	}

	render(){
		return(
			<table>
				<thead>
					<tr><th>Imagen</th><th>Id</th><th>Correo</th><th>Nombre</th><th>Apellido</th><th>Contraseña</th><th>Suscripción</th><th>Mano a mano restantes</th><th>Puntaje</th></tr>
				</thead>
				{this.state.usuarios}
			</table>
		);
	}
}

export default ObtenerUsuarios;