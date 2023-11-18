import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';


const Login = () => {
  const [email, setName] = useState('');
  const [pass, setPass] = useState('');

  const [error, setError] = useState('');

  const navigate = useNavigate();

  const parseToken = (token) => {
    const decodedToken = token.split('.')[1];
    const decodedData = JSON.parse(atob(decodedToken));
    return decodedData;
  };

  const datosLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8888/api/v1/devcamps/users/login', {
        email,
        password:pass,
      });
      console.log('Después de la solicitud'); // Añade esta línea

      if (response.data && response.data.token) {
        const tokenPayload = parseToken(response.data.token);
        if (tokenPayload && tokenPayload.role) {  
            const { name, token } = tokenPayload;        
          if (tokenPayload.role === 'doctor') {
            localStorage.setItem('token', token);
          localStorage.setItem('name', name)
            navigate('/home');
          } else if (tokenPayload.role === 'paciente') {
            navigate('/homeC');
          }
        }
      }
      setError('');
    } catch (error) {
        console.error('Error en el inicio de sesión:', error);
        
        if (error.response) {
          console.error('Respuesta del servidor:', error.response.data);
        } else if (error.request) {
          console.error('No se recibió respuesta del servidor:', error.request);
        } else {
          console.error('Error al configurar la solicitud:', error.message);
        }
      }
    };

  return (
    <section>
      <div className='form-container'>
        <h1>Login</h1>
        {error && (
            <div className='mensajeE'>
            {error}
            </div>
        )}
        <form autoComplete='off' onSubmit={datosLogin}>
          <div className='control'>
            <label>email</label>
            <input type='text' name='email' id='name' required value={email} onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className='control'>
            <label>Password</label>
            <input type='password'name='password' id='pass' required value={pass} onChange={(e) => setPass(e.target.value)}
            />
          </div>
          <div className='control'>
            <input type='submit' value='ingresar' />
          </div>
        </form>
        <div className='link'>
          <Link to={"/register"}>Registrarse</Link><br/>
        </div>
      </div>

    </section>
  );
};

export default Login;