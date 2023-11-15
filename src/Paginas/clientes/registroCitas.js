import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';


const RegistroCita = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  return (
    <div>
      <nav className='menu'>
        <label className='logo'>Agende Su Cita</label>
        <ul className={`menu_items ${menuOpen ? 'show' : ''}`}>
          <li className='active'><Link to={"/homeC"}>Inicio</Link></li>
          <li><Link to={"#"}>Perfil</Link></li>
          <li><Link to={"/"}>Cerrar Sesion</Link></li>
        </ul>
        <span className={`btn_menu ${menuOpen ? 'hide' : ''}`} onClick={toggleMenu}>
  <FaBars />
</span>
      </nav>
      <div className='form-container3'>
            <h1>Registro</h1>
            <form autoComplete='off'>
                <div className='control3'>
                    <label>Nombre Y Apellidos</label>
                    <input type='text' name='name' id='name'/>
                </div>
                <div className='control3'>
                    <label>Numero De Documento</label>
                    <input type='text' name='pass' id='pass'/>
                </div>
                <div className='control3'>
                    <label>Fecha De La Cita</label>
                    <input type='date' name='pass' id='pass'/>
                </div>
                <div className='control3'>
                    <label>Hora De La Cita</label>
                    <input type='time' name='pass' id='pass'/>
                </div>
                
                <div className='control3'>
                    <input type='submit' value='Agenda'/>
                </div>
            </form>
            </div>
    </div>
  );
}

export default RegistroCita;