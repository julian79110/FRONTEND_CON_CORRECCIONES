import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import axios from 'axios';

const RegistroCita = ({ userName }) => {
  const [cita, setCita] = useState({
    nombre: '',
    numeroDocumento: '',
    fechaCita: '',
    horaCita: '',
    doctorAsignado: 'doctorAsignado',
  });

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [doctoresDisponibles, setDoctoresDisponibles] = useState([]);

  const name = localStorage.getItem('name');
  const documento = localStorage.getItem('numeroDoc');

  useEffect(() => {
    const fetchDoctoresDisponibles = async () => {
      try {
        const response = await axios.get(
          'http://localhost:8888/api/v1/devcamps/users/disponibles?disponibilidad=true&role=doctor'
        );

        if (response.data.success) {
          setDoctoresDisponibles(response.data.data);
        }
      } catch (error) {
        console.error('Error al obtener doctores disponibles:', error);
      }
    };

    fetchDoctoresDisponibles();
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('name');
    window.location.href = '/';
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setCita((prevCita) => ({
      ...prevCita,
      [name]: value,
    }));
  };

  const validarDoctor = async () => {
    try {
      const responseValidarDoctor = await axios.post(
        'http://localhost:8888/api/v1/devcamps/citas/validarDoctor',
        { doctorAsignado: cita.doctorAsignado }
      );

      return responseValidarDoctor.data && responseValidarDoctor.data.excedeLimite === true;
    } catch (error) {
      console.error('Error al validar doctor:', error);
      return false;
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const excedeLimite = await validarDoctor();
  
      if (excedeLimite) {
        setError('Ya ha seleccionado el máximo de 4 citas con este doctor');
        return;
      }
  
      // Registrar la cita
      await axios.post(
        'http://localhost:8888/api/v1/devcamps/citas/register',
        {
          nombre: name,
          numeroDocumento: documento,
          fechaCita: cita.fechaCita,
          horaCita: cita.horaCita,
          doctorAsignado: cita.doctorAsignado,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
  
      setSuccessMessage('Cita agendada con éxito');
      setError('');
    } catch (error) {
      console.error('Error en el registro:', error);
  
      if (error.response && error.response.data && error.response.data.message) {
        setError('Error: ' + error.response.data.message);
      } else {
        setError('Error al registrar: no tenemos fecha disponible en la que ha seleccionado');
      }
    }
  };

  return (
    <div>
      <nav className='menu'>
        <label className='logo'>Agende Su Cita</label>
        <ul className={`menu_items ${menuOpen ? 'show' : ''}`}>
          <li className='active'>
            <Link to='/homeC'>Inicio</Link>
          </li>
          <li>
            <button onClick={handleLogout}>Cerrar Sesion</button>
          </li>
        </ul>
        <span className={`btn_menu ${menuOpen ? 'hide' : ''}`} onClick={toggleMenu}>
          <FaBars />
        </span>
      </nav>
      <div className='form-container3'>
        <h1>Registro</h1>
        {error && <div className='mensajeError2'>{error}</div>}
        {successMessage && <div className='mensajeExito'>{successMessage}</div>}
        <form autoComplete='off' onSubmit={onSubmit}>
          <div className='control3'>
            <label>Nombres Y Apellidos</label>
            <input type='text' name='nombre' id='nombre' onChange={onChange} value={name} required readOnly />
          </div>
          <div className='control3'>
            <label>Numero De Documento</label>
            <input
              type='text'
              name='numeroDocumento'
              id='numeroDocumento'
              readOnly
              required
              onChange={onChange}
              value={documento}
            />
          </div>
          <div className='control3'>
            <label>Fecha De La Cita</label>
            <input
              type='date'
              name='fechaCita'
              id='fechaCita'
              required
              onChange={onChange}
              value={cita.fechaCita}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div className='control3'>
            <label>Hora De La Cita</label>
            <input type='time' name='horaCita' id='horaCita' required onChange={onChange} value={cita.horaCita} />
          </div>
          {doctoresDisponibles.length > 0 && (
            <div className='doctoresDisponibles'>
              <h2>Doctores Disponibles</h2>
              <select name='doctorAsignado' onChange={onChange} value={cita.doctorAsignado}>
                <option value='' disabled>
                  Seleccionar Doctor
                </option>
                {doctoresDisponibles.map((doctor) => (
                  <option key={doctor._id} value={doctor.name}>
                    {doctor.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className='control3'>
            <input type='submit' value='Agenda' />
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistroCita;
