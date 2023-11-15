import React, { useState } from 'react';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Link } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';

const Citas = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };
  return (
    <div>
         <nav className='menu'>
        <label className='logo'>Nombre</label>
        <ul className={`menu_items ${menuOpen ? 'show' : ''}`}>
          <li className='active'><Link to={"/home"}>Inicio</Link></li>
          <li><Link to={"#"}>Perfil</Link></li>
          <li><Link to={"/"}>Cerrar Sesion</Link></li>
        </ul>
        <span className={`btn_menu ${menuOpen ? 'hide' : ''}`} onClick={toggleMenu}>
  <FaBars />
</span>
      </nav>
      <br></br>
      <br></br>
      <div className='contenedor_tabla'>
          <table className='tabla'>
            <thead className='cabeza'>
                <tr>
                  <th>Nombre Paciente</th>
                  <th>Numero Documento</th>
                  <th>Fecha Cita</th>
                  <th>Hora Cita</th>
                  <th>Editar</th>
                  <th>Eliminar</th>
                </tr>
            </thead>
            <tbody className='cuerpo'>
              <tr>
                <td>Julian Tique</td>
                <td>1030544851</td>
                <td>14/11/2023</td>
                <td>6:53pm</td>
                <td><button className='botonT2'>Editar</button></td>
                <td><button className='botonT'>Eliminar</button></td>
              </tr>
              <tr>
                <td>Julian Tique</td>
                <td>1030544851</td>
                <td>14/11/2023</td>
                <td>6:53pm</td>
                <td><button className='botonT2'>Editar</button></td>
                <td><button className='botonT'>Eliminar</button></td>
              </tr>
            </tbody>
          </table>
      </div>

    </div>
  );
};

export default Citas;
