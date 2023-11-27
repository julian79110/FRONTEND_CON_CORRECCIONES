import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import axios from 'axios';

const Citas = () => {
  const id = localStorage.getItem('id')
  const [menuOpen, setMenuOpen] = useState(false);
  const [citas, setCitas] = useState([]);
  const [mensajeExito, setMensajeExito] = useState("");

  useEffect(() => {
    const fetchCitas = async () => {
      try {
        const name = localStorage.getItem('name')
        const response = await axios.get(`http://localhost:8888/api/v1/devcamps/citas/busquedaD/${name}`);
        setCitas(response.data.results);
      } catch (error) {
        console.error("Error al obtener citas:", error);
      }
    };

    fetchCitas();
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('name');
    window.location.href = '/';
  };

  const handleEliminarCita = async (citaId) => {
    const confirmacion = window.confirm("¿Estás seguro de que deseas eliminar esta cita?");
    if (confirmacion) {
      try {
        await axios.delete(`http://localhost:8888/api/v1/devcamps/citas/${citaId}`);
        const updatedCitas = citas.filter((cita) => cita._id !== citaId);
        setCitas(updatedCitas);
        setMensajeExito("Cita eliminada con éxito.");
      } catch (error) {
        console.error("Error al eliminar la cita:", error);
      }
    }
  };

  const handleAtenderCita = async (citaId) => {
    const confirmacion = window.confirm("¿Estás seguro de que deseas modificar el estado de esta cita?");
    if (confirmacion) {
      try {
        await axios.put(`http://localhost:8888/api/v1/devcamps/citas/cancelarCita/${citaId}`);
        const updatedCitas = citas.map((cita) => {
          if (cita._id === citaId) {
            return {
              ...cita,
              estado: "atendida"
            };
          }
          return cita;
        });
  
        setCitas(updatedCitas);
        setMensajeExito("Cita atendida con éxito.");
      } catch (error) {
        console.error("Error al cancelar la cita:", error);
      }
    }
  };

  
  return (
    <div>
         <nav className='menu'>
        <label className='logo'>Nombre</label>
        <ul className={`menu_items ${menuOpen ? 'show' : ''}`}>
          <li className='active'><Link to={"/home"}>Inicio</Link></li>
          <li><Link to={"/"}>Cerrar Sesion</Link></li>
        </ul>
        <span className={`btn_menu ${menuOpen ? 'hide' : ''}`} onClick={toggleMenu}>
  <FaBars />
</span>
      </nav>
      <div className="centrar">
        <table>
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Nombre</th>
              <th scope="col">Número de Documento</th>
              <th scope="col">Fecha de Cita</th>
              <th scope="col">Hora de Cita</th>
              <th scope="col">Estado</th>
              <th scope="col">Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {citas.map((cita, index) => (
              <tr key={index}>
                <th scope="row">{index + 1}</th>
                <td>{cita.nombre}</td>
                <td>{cita.numeroDocumento}</td>
                <td>{cita.fechaCita}</td>
                <td>{cita.horaCita}</td>
                <td>{cita.estado}</td>
                <td>
                  <button className="editar" onClick={() => handleAtenderCita(cita._id)}>
                    Atendida
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Citas;
