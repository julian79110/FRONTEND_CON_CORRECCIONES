import React, { useState,useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';


const Register = () => {
    const [usuario, setUsuario] = useState({
        name: '',
        email: '',
        numeroDoc: '',
        password: '',
        tipoDoc: '',
        role: 'admin',
      });
    
      const { name, email, numeroDoc, password, tipoDoc, role } = usuario;
      const [error, setError] = useState('');
      const [successMessage, setSuccessMessage] = useState('');
    
      const handleRegister = async () => {
        try {
          // Establecer la disponibilidad en función del rol seleccionado
          const disponibilidad = role === 'doctor';
    
          const response = await axios.post(
            'http://localhost:8888/api/v1/devcamps/users/register',
            {
              ...usuario,
              disponibilidad,
            },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
    
          setSuccessMessage('Usuario creado con éxito');
          setError('');
        } catch (error) {
          if (error.response) {
            console.log('Respuesta del servidor:', error.response);
            if (error.response.data && error.response.data.message) {
              setError('Error: ' + error.response.data.message);
            } else {
              setError('Error en el registro: ' + error.message);
            }
          } else {
            setError('Error en el registro: ' + error.message);
          }
        }
      };
    
      const onChange = (e) => {
        setUsuario({
          ...usuario,
          [e.target.name]: e.target.value,
        });
      };
    
      const onSubmit = (e) => {
        e.preventDefault();
        handleRegister();
      };
  return (
    <section>
    <div className='form-container2'>
        <h1>Registro</h1>
        {successMessage && (
        <div className='mensajeExito'>
            {successMessage}
        </div>
        )}
        {error && (
            <div className='mensajeE'>
            {error}
            </div>
        )}
        <br/>
        <br/>
        <form autoComplete='off' onSubmit={onSubmit}>
            <div className="form-row">
            {/* Primer grupo de campos */}
            <div className='form-column'>
                <div className='control2'>
                <label>Nombre</label>
                <input type='text' name='name' id='name' onChange={onChange} value={name} required />
                </div>
                <div className='control2'>
                <label>Email</label>
                <input type='text' name='email' id='email' onChange={onChange} value={email} required />
                </div>
                <div className='control2'>
                <label>Contraseña</label>
                <input type='password' name='password' id='pass' onChange={onChange} value={password} required />
                </div>
            </div>

            {/* Segundo grupo de campos */}
            <div className='form-column'>
            <div className='control2'>
                <select name="tipoDoc" value={tipoDoc} onChange={onChange}>
                    <option value="" selected hidden>Tipo De Documento</option>
                    <option value="ti">Tarjeta de identidad</option>
                    <option value="cc">cedula de ciudadania</option>
                    <option value="pp">pasaporte</option>
                </select>
                </div>
                <div className='control2'>
                <label>Numero De Documento</label>
                <input type='text' name='numeroDoc' id='doc' onChange={onChange} value={numeroDoc} required />
                </div>
                
            </div>
            </div>

            {/* Tercer grupo de campos */}
            <div className='form-row'>
            <div className='form-column'>
                
            </div>
            <div className='form-column'>
            <div className='control2'>
                  <input type="hidden" readOnly name="role" value={role} onChange={onChange}></input>
                </div>
            
            </div>
            </div>

            

            <div className='control2'>
            <input type='submit' value='Registrarse' />
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