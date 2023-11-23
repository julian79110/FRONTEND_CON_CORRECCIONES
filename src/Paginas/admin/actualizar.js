import React, { useState,useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import axios from 'axios';

const ActualizarD = () =>{
    const name = localStorage.getItem('name');
    const email = localStorage.getItem('email');
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
    return(
        <div>
            <nav className='menu'>
        <label className='logo'>Admin</label>
        <ul className={`menu_items ${menuOpen ? 'show' : ''}`}>
          <li className='active'><Link to={"/home"}>Inicio</Link></li>
          <li><Link to={"#"}>Ver usuarios</Link></li>
          <li><button onClick={handleLogout}>Cerrar Sesion</button></li>
        </ul>
        <span className={`btn_menu ${menuOpen ? 'hide' : ''}`} onClick={toggleMenu}>
  <FaBars />
</span>
      </nav>
      <br/>
      <br/>
      <div className='form-container3'>
        <h1>Actualizar</h1>
        <form autoComplete='off'>
          {/* Campos del formulario */}
          <div className='control3'>
            <label>Nombre</label>
            <input type='text' name='name' id='name' value={name}/>
          </div>
          <div className='control3'>
            <label>Correo</label>
            <input type='text' name='email' id='email' value={email} />
          </div>
          <div className='control3'>
            <label>Password</label>
            <input type='password' name='password' id='fechaCita' />
          </div>
          <div className='control3'>
            <input type='submit' value='Actualizar' />
          </div>
        </form>
      </div>
        </div>
    )
} 

export default ActualizarD