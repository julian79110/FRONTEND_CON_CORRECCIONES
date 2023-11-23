import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import axios from 'axios';

const RegistroCita = ({userName}) => {  
  const name = localStorage.getItem('name');
  const documento = localStorage.getItem('numeroDoc')
  const [cita, setCita] = useState({
    nombre: '',
    numeroDocumento: '',
    fechaCita: '',
    horaCita: '',
    doctorAsignado: ''
  });

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);


  const registerCita = async () => {
    try {
      const { nombre, numeroDocumento, fechaCita, horaCita, doctorAsignado } = cita;
      
  
      // Buscar doctores con disponibilidad
      const responseDoctores = await axios.get(
        `http://localhost:8888/api/v1/devcamps/users/disponibles?disponibilidad=true&role=doctor`
      );
  
      const doctoresDisponibles = responseDoctores.data.data;
  
      if (doctoresDisponibles.length > 0) {
        const doctorId = doctoresDisponibles[0]._id;
  
        // Registrar la cita
        const responseCita = await axios.post(
          'http://localhost:8888/api/v1/devcamps/citas',
          {
            nombre:name,
            numeroDocumento:documento,
            fechaCita,
            horaCita,
            doctorAsignado
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
  
        setSuccessMessage('Cita agendada con éxito');
        setError('');
  
        // Actualizar la disponibilidad del doctor después de agendar la cita
        await axios.patch(
          `http://localhost:8888/api/v1/devcamps/users/${doctorId}`,
          {
            disponibilidad: false, // Cambia a false ya que el doctor ya no estará disponible después de agendar la cita
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
      } else {
        setError('No hay doctores disponibles disponibles');
      }
    } catch (error) {
      console.error('Error en el registro:', error);
  
      if (error.response) {
        console.log('Respuesta del servidor:', error.response);
        if (
          error.response.status === 500 &&
          error.response.data &&
          error.response.data.message
        ) {
          setError('Error: ' + error.response.data.message);
        } else {
          setError('Error: ya tiene agendada una cita. La fecha o la hora ya estan registradas');
        }
      } else {
        setError('Error en el : ' + error.message);
      }
    }
  };

  const onChange = (e) => {
    const { name, value } = e.target;
  
    // Verifica si el campo que cambió es el campo del doctor y actualiza el estado en consecuencia
    if (name === 'doctorAsignado') {
      setCita((prevCita) => ({
        ...prevCita,
        [name]: value,
      }));
    } else {
      // Si no es el campo del doctor, actualiza los demás campos normalmente
      setCita({
        ...cita,
        [name]: value,
      });
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    registerCita();
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    // Limpiar localStorage al cerrar sesión
    localStorage.removeItem('name');
    // Redirigir a la página de inicio de sesión
    // Puedes usar useHistory() o Link para redirigir según tu configuración de enrutamiento
    window.location.href = '/';
  };

  // Agrega un nuevo estado para almacenar la lista de doctores disponibles
  const [doctoresDisponibles, setDoctoresDisponibles] = useState([]);

  useEffect(() => {
    // Función asincrónica para obtener doctores disponibles
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

    // Llama a la función para obtener doctores disponibles al cargar el componente
    fetchDoctoresDisponibles();
  }, []); // La dependencia es un arreglo vacío para ejecutar solo una vez al montar el componente


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
      <div className='form-container3'>
        <h1>Registro</h1>
        {error && (
          <div className='mensajeError2'>
            {error}
          </div>
        )}
        {successMessage && (
          <div className='mensajeExito'>
            {successMessage}
          </div>
        )}
        <form autoComplete='off' onSubmit={onSubmit}>
          <div className='control3'>
            <label>Nombres Y Apellidos</label>
            <input type='text' name='nombre' id='nombre' onChange={onChange} value={name} required readOnly />
          </div>
          <div className='control3'>
            <label>Numero De Documento</label>
            <input type='text' name='numeroDocumento' id='numeroDocumento'  readOnly required onChange={onChange} value={documento} />
          </div>
          <div className='control3'>
            <label>Fecha De La Cita</label>
            <input type='date' name='fechaCita' id='fechaCita' required onChange={onChange} value={cita.fechaCita} />
          </div>
          <div className='control3'>
            <label>Hora De La Cita</label>
            <input type='time' name='horaCita' id='horaCita' required onChange={onChange} value={cita.horaCita} />
          </div>
          {/* Agrega un bloque de código para mostrar la lista de doctores disponibles */}
        {doctoresDisponibles.length > 0 && (
          <div className='doctoresDisponibles'>
            <h2>Doctores Disponibles</h2>
            <select name="doctorAsignado" onChange={onChange}>
              {doctoresDisponibles.map((doctor) => (
                <option key={doctor._id} value={doctor.name}>{doctor.name}</option>
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
}

export default RegistroCita;
