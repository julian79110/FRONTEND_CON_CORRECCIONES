import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import axios from "axios";
import Modal from 'react-modal';

const VerCitas = ({userName}) => {
  
  const [menuOpen, setMenuOpen] = useState(false);
  const [citas, setCitas] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [citaSeleccionada, setCitaSeleccionada] = useState(null);
  const [nuevaInformacion, setNuevaInformacion] = useState({
    nombre: "",
    numeroDocumento: "",
    fechaCita: "",
    horaCita: "",
    doctorAsignado:""
  });
  const [mensajeExito, setMensajeExito] = useState("");

  useEffect(() => {
    const fetchCitas = async () => {
      try {
        const numeroDocumento = localStorage.getItem('numeroDoc');
        const response = await axios.get(`http://127.0.0.1:8888/api/v1/devcamps/citas/busqueda/${numeroDocumento}`);
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

  const handleEditarCita = (cita) => {
    setCitaSeleccionada(cita);
    setNuevaInformacion({
      nombre: cita.nombre,
      numeroDocumento: cita.numeroDocumento,
      fechaCita: cita.fechaCita,
      horaCita: cita.horaCita
    });
    openModal();
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setCitaSeleccionada(null);
    setNuevaInformacion({
      nombre: "",
      numeroDocumento: "",
      fechaCita: "",
      horaCita: ""
    });
  };

  const handleActualizarCita = async () => {
    try {
      await axios.put(`http://localhost:8888/api/v1/devcamps/citas/${citaSeleccionada._id}`, nuevaInformacion);
      const updatedCitas = citas.map((cita) => {
        if (cita._id === citaSeleccionada._id) {
          return {
            ...cita,
            ...nuevaInformacion
          };
        }
        return cita;
      });

      setCitas(updatedCitas);
      closeModal();
      setMensajeExito("Cita actualizada con éxito.");
    } catch (error) {
      console.error("Error al actualizar la cita:", error);
    }
  };

  const handleChangeNuevaInformacion = (e) => {
    setNuevaInformacion({
      ...nuevaInformacion,
      [e.target.name]: e.target.value
    });
  };

  const handleCerrarMensajeExito = () => {
    setMensajeExito("");
  };

  return (
    <div>
      <nav className='menu'>
        <label className='logo'>Agende Su Cita</label>
        <ul className={`menu_items ${menuOpen ? 'show' : ''}`}>
          <li className='active'><Link to={"/homeC"}>Inicio</Link></li>

          <li><button onClick={handleLogout}>Cerrar Sesion</button></li>
        </ul>
        <span className={`btn_menu ${menuOpen ? 'hide' : ''}`} onClick={toggleMenu}>
          <FaBars />
        </span>
      </nav>
      <div className="mensajeCentrar">
      {mensajeExito && (
        <div className="mensaje-exito">
          <p>{mensajeExito}</p> <button onClick={handleCerrarMensajeExito}>&times;</button>
        </div>
      )}
      </div>
      <div className="centrar">
        <table>
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Nombre</th>
              <th scope="col">Número de Documento</th>
              <th scope="col">Fecha de Cita</th>
              <th scope="col">Hora de Cita</th>
              <th scope="col">Doctor</th>
              <th scope="col">Eliminar</th>
              <th scope="col">Editar</th>
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
                <td>{cita.doctorAsignado}</td>
                <td>
                  <button className="eliminar" onClick={() => handleEliminarCita(cita._id)}>
                    Eliminar
                  </button>
                </td>
                <td>
                  <button className="editar" onClick={() => handleEditarCita(cita)}>
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="modal">
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Editar Cita"
        >
          {citaSeleccionada && (
            <div className="modal-content">
              <h2>Editar Cita</h2><br/>
              <input
                type="text"
                name="nombre"
                value={nuevaInformacion.nombre}
                onChange={handleChangeNuevaInformacion}
              /><br/><br/>
              <input
                type="text"
                name="numeroDocumento"
                value={nuevaInformacion.numeroDocumento}
                onChange={handleChangeNuevaInformacion}
              /><br/><br/>
              <input
                type="date"
                name="fechaCita"
                value={nuevaInformacion.fechaCita}
                onChange={handleChangeNuevaInformacion}
              /><br/><br/>
              <input
                type="time"
                name="horaCita"
                value={nuevaInformacion.horaCita}
                onChange={handleChangeNuevaInformacion}
              /><br/>
              <button onClick={handleActualizarCita}>Actualizar</button><br/>
              <button onClick={closeModal}>Cerrar</button>
            </div>
          )}
        </Modal>
      </div>
    </div>
    </div>
  );
};

export default VerCitas;
