import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import axios from 'axios';

const ActualizarD = () => {
  const nameLocal = localStorage.getItem('name');
  const emailLocal = localStorage.getItem('email');
  const numeroDoc = localStorage.getItem('numeroDoc');
  const [name, setName] = useState(nameLocal);
  const [email, setEmail] = useState(emailLocal);
  const [password, setPassword] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('name');
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Realizar la solicitud de actualización
      await axios.put(`http://localhost:8888/api/v1/devcamps/users/actualizarDoctor/${numeroDoc}`, {
        name,
        email,
        password,
      });

      setMensajeExito('Perfil actualizado con éxito');
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      // Maneja el error de acuerdo a tus necesidades
    }
  };

  return (
    <div>
      <nav className='menu'>
        <label className='logo'>Admin</label>
        <ul className={`menu_items ${menuOpen ? 'show' : ''}`}>
          <li className='active'><Link to={"/home"}>Inicio</Link></li>
          <li><button onClick={handleLogout}>Cerrar Sesion</button></li>
        </ul>
        <span className={`btn_menu ${menuOpen ? 'hide' : ''}`} onClick={toggleMenu}>
          <FaBars />
        </span>
      </nav>
      <br />
      <br />
      <div className='form-container3'>
        <h1>Actualizar</h1>
        {mensajeExito && <div className='mensajeExito'>{mensajeExito}</div>}
        <form autoComplete='off' onSubmit={handleSubmit}>
          <div className='control3'>
            <label>Nombre</label>
            <input type='text' name='name' id='name' value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className='control3'>
            <label>Correo</label>
            <input type='text' name='email' id='email' value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className='control3'>
            <label>Número de Documento</label>
            <input type='text' name='numeroDoc' id='numeroDoc' value={numeroDoc} readOnly />
          </div>
          <div className='control3'>
            <label>Password</label>
            <input type='password' name='password' id='fechaCita' onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className='control3'>
            <input type='submit' value='Actualizar' />
          </div>
        </form>
      </div>
    </div>
  );
}

export default ActualizarD;
