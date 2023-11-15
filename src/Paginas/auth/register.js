import React, { useState,useEffect } from 'react';
import { Link } from 'react-router-dom';
import APIINVOKE from '../../utils/APIINVOKE';
import swal from 'sweetalert';

const Register = () => {
    const[usuario, setUsuario] =useState({
        nombre:'',
        apellido:'',
        doc:'',
        pass:'',
        tipo:''
    })

    const{nombre, apellido, doc, pass, tipo} =usuario;

    const onChange = (e) => {
        setUsuario({
            [e.target.name]: e.target.value
        })
        
    }
    useEffect(() =>{document.getElementById("name").focus();}, [])

    const crearCuenta = async () => {
        const data = {
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            doc: usuario.doc,
            pass: usuario.pass,
            tipo: usuario.tipo
        }
        const response = await APIINVOKE.invokePOST(`/api/usuarios`, data);
        console.log(response)
    }
    const onSubmit = (e) => {
        e.preventDefault();
        crearCuenta();
      };
  return (
    <section>
        <div className='form-container2'>
            <h1>Registro</h1>
            <form autoComplete='off' onSubmit={onSubmit}>
                <div className='control2'>
                    <label>Nombre</label>
                    <input type='text' name='name' id='name' value={nombre} onChange={onChange} required/>
                </div>
                <div className='control2'>
                    <label>Apellido</label>
                    <input type='text' name='last_name' id='last_name' value={apellido} onChange={onChange} required/>
                </div>
                <div className='control2'>
                    <label>Numero De Documento</label>
                    <input type='text' name='doc' id='doc' value={doc} onChange={onChange}required/>
                </div>
                <div className='control2'>
                    <label>Contraseña</label>
                    <input type='text' name='pass' id='pass' value={pass} onChange={onChange} required/>
                </div>
                <div className='control2'>
                    <select name="tipo" value={tipo} onChange={onChange}>
                      <optgroup label="Tipo Documento" disabled>
                      <option value="" selected hidden>Tipo De Documento</option>
                      </optgroup>
                      <option>Tarjeta De Identidad</option>
                      <option>Cedula De Ciudadania</option>
                      <option>Pasaporte</option>
                    </select>
                </div>
                <div className='control2'>
                    <input type='submit' value='Registrarse'/>
                </div>
            </form>
            <div className='link2'>
                <Link to={"/"}>Iniciar Sesion</Link>
            </div>
        </div>
    </section>
  );
}

export default Register;