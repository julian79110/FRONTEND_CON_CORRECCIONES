import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';


const HomeC = ({userName}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const name = localStorage.getItem('name');
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    // Limpiar localStorage al cerrar sesión
    localStorage.removeItem('name');
    localStorage.removeItem('numeroDoc');
    // Redirigir a la página de inicio de sesión
    // Puedes usar useHistory() o Link para redirigir según tu configuración de enrutamiento
    window.location.href = '/';
  };
  return (
    <div>
      <nav className='menu'>
        <label className='logo'>Paciente</label>
        <ul className={`menu_items ${menuOpen ? 'show' : ''}`}>
          <li className='active'><Link to={"#"}>Inicio</Link></li>
          <li><Link to={"/verCitas"}>Ver Citas</Link></li>
          <li><button onClick={handleLogout}>Cerrar Sesion</button></li>
        </ul>
        <span className={`btn_menu ${menuOpen ? 'hide' : ''}`} onClick={toggleMenu}>
  <FaBars />
</span>
      </nav>
      <div className='imagen'>
      <img src="perfil.png" />
      </div>
      <div className='textW'>
      Bienvenid@: {name || 'Invitado'}<br />
      </div>
      <div className='botonC2'>
        <Link to="/registrarCitas">
          Registre su cita aquí
        </Link>
      </div>
    </div>
  );
}

export default HomeC;