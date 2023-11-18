import React, { useState,useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';


const Home = ({ userName }) => {
  const name = localStorage.getItem('name');
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  return (
    <div>
      <nav className='menu'>
        <label className='logo'>Doctor</label>
        <ul className={`menu_items ${menuOpen ? 'show' : ''}`}>
          <li className='active'><Link to={"#"}>Inicio</Link></li>
          <li><Link to={"#"}>Perfil</Link></li>
          <li><Link to={"/"}>Cerrar Sesion</Link></li>
        </ul>
        <span className={`btn_menu ${menuOpen ? 'hide' : ''}`} onClick={toggleMenu}>
  <FaBars />
</span>
      </nav>
      <div className='imagen'>
      <img src="perfil.png" />
      </div>
      <div className='textW'>
      Bienvenid@: {name || 'Invitado'}
      </div>
      <div className='botonC'>
        <Link to={"/citas"}>Citas</Link>
      </div>
    </div>
  );
}

export default Home;