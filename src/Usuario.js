import React, { Component } from 'react';

class Usuario extends Component{
	
	render(){ 
		return(
			<tbody>
				<tr>
					<td><img src={this.props.img} alt="imagen usuario"/></td>
					<td><span>{this.props.id}</span></td>
					<td><span>{this.props.correo}</span></td>
					<td><span>{this.props.nombre}</span></td>
					<td><span>{this.props.apellido}</span></td>
					<td><span>{this.props.pass}</span></td>
					<td><span>{this.props.tipo}</span></td>
					<td><span>{this.props.mmrestantes}</span></td>
					<td><span>{this.props.puntaje}</span></td>
				</tr>
			</tbody>
		);
	}
}

export default Usuario;