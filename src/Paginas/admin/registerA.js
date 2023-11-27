import React, { useState,useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaBars } from 'react-icons/fa';

const RegisterA = () => {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
      };
    const [usuario, setUsuario] = useState({
        name: '',
        email: '',
        numeroDoc: '',
        password: '',
        tipoDoc: '',
        role: '',
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

      const validarNumeroDocumento = (name, value, tipoDoc) => {
        let regexPattern;
      
        if (tipoDoc === 'cc' || tipoDoc ==='ti') {
          // Permitir solo números para cédula de ciudadanía
          regexPattern = /^\d+$/;
        } else if (tipoDoc === 'pp') {
          // Permitir números y letras para pasaporte
          regexPattern = /^[a-zA-Z0-9]+$/;
        } 
      
        if (!regexPattern.test(value)) {
          setError('Número de documento inválido');
          return false;
        }
      
        // Si pasa la validación, no hay error
        setError('');
        return true;
      };

      const validarCorreo = (email) => {
        // Expresión regular para validar el correo electrónico
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
        // Verificar si el correo electrónico cumple con el patrón
        if (emailPattern.test(email)) {
          // Si es válido, no hay error
          setError('');
          return true;
        }
      
        // Si es inválido, mostrar un mensaje de error
        setError('Correo electrónico no válido');
        return false;
      };
    
      const onChange = (e) => {
        const { name, value } = e.target;

        if (name === 'email') {
            validarCorreo(value);
          }
      
        // Validar el número de documento solo cuando se cambia el número de documento
        if (name === 'numeroDoc') {
          const isValid = validarNumeroDocumento(name, value, usuario.tipoDoc);
          if (!isValid) {
            // Si la validación falla, no actualices el estado y deja que el mensaje de error sea manejado por la función de validación
            return;
          }
        }
      
        // Actualizar el estado del usuario
        setUsuario({
          ...usuario,
          [name]: value,
        });
      
        // Limpiar el mensaje de error después de una entrada válida
        setError('');
      };

      const onSubmit = (e) => {
        e.preventDefault();
        handleRegister();
      };
      const handleLogout = () => {
        localStorage.removeItem('name');
        localStorage.removeItem('token');
        navigate('/');
      };
  return (
    <div>
        <nav className='menu'>
        <label className='logo'>Admin</label>
        <ul className={`menu_items ${menuOpen ? 'show' : ''}`}>
          <li className='active'><Link to={"/admin"}>Inicio</Link></li>
          <li><button onClick={handleLogout}>Cerrar Sesion</button></li>
        </ul>
        <span className={`btn_menu ${menuOpen ? 'hide' : ''}`} onClick={toggleMenu}>
        <FaBars />
        </span>
      </nav>
    <div className='form-containerA'>
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
                <input type='email' name='email' id='email' onChange={onChange} value={email} required pattern='[^\s@]+@[^\s@]+\.[^\s@]+' title='Email Invalido' />
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
                <option value="" selected hidden required>Tipo Documento</option>
                    <option value="ti">Tarjeta de identidad</option>
                    <option value="cc">cedula de ciudadania</option>
                    <option value="pp">pasaporte</option>
                </select>
                </div>
                <div className='control2'>
                <label>Numero De Documento</label>
                <input type='text' name='numeroDoc' id='doc' onChange={onChange} value={numeroDoc} required />
                </div>

                <div className='control2'>
                  <select name="role" value={role} onChange={onChange}>
                    <option value="" selected hidden required>Rol</option>
                    <option value="paciente">Paciente</option>
                    <option value="admin">Admin</option>
                    <option value="doctor">Doctor</option>
                  </select>
                </div>
                
            </div>
            </div>

            <div className='control2'>
            <input type='submit' value='Registrar' />
            </div>
        </form>
        </div>
    </div>
  );
}

export default RegisterA;