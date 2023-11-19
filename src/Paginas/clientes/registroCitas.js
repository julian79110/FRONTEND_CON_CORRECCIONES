import React, { useState } from 'react';
import { Link, useLocation  } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import axios from 'axios';


const RegistroCita = () => {
  const [cita, setCita] = useState({
    nombre: '',
    numeroDocumento: '',
    fechaCita: '',
    horaCita: ''
  });

  const{nombre, numeroDoc, fecha, hora} =cita;
const [error, setError] = useState('');
const [successMessage, setSuccessMessage] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const registerCita = async () => {
    try {

      const response = await axios.post('http://localhost:8888/api/v1/devcamps/citas', cita, {
headers: {
'Content-Type': 'application/json',
},
});  
    setSuccessMessage('cita agendada con éxito');
    setError('');
    } catch (error) {
    console.error('Error en el registro:', error);

    if (error.response) {
      console.log('Respuesta del servidor:', error.response);
      if (error.response.status === 500 && error.response.data && error.response.data.message) {
        setError('Error: ' + error.response.data.message);
      } else {
        setError('Error: fecha o hora existente, solo puedes registrar una cita' );
      }
    } else {
      setError('Error en el : ' + error.message);
    }
  }
};

  const onChange = (e) => {
    setCita({
      ...cita,
      [e.target.name]: e.target.value
    });
  };


const onSubmit = (e) => {
    e.preventDefault();
    registerCita()
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
  return (
    <div>
      <nav className='menu'>
        <label className='logo'>Agende Su Cita</label>
        <ul className={`menu_items ${menuOpen ? 'show' : ''}`}>
          <li className='active'><Link to={"/homeC"}>Inicio</Link></li>
          <li><Link to={"#"}>Perfil</Link></li>
          <li><button onClick={handleLogout}>Cerrar Sesion</button></li>
        </ul>
        <span className={`btn_menu ${menuOpen ? 'hide' : ''}`} onClick={toggleMenu}>
  <FaBars />
</span>
      </nav>
      <div className='form-container3'>
            <h1>Registro</h1>
            {error && (
            <div className='mensajeE'>
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
                <input type='text' name='nombre' id='nombre' onChange={onChange} value={cita.nombre} />
              </div>
              <div className='control3'>
                <label>Numero De Documento</label>
                <input type='text' name='numeroDocumento' id='numeroDocumento' onChange={onChange} value={cita.numeroDocumento} />
              </div>
              <div className='control3'>
                <label>Fecha De La Cita</label>
                <input type='date' name='fechaCita' id='fechaCita' onChange={onChange} value={cita.fechaCita} />
              </div>
              <div className='control3'>
                <label>Hora De La Cita</label>
                <input type='time' name='horaCita' id='horaCita' onChange={onChange} value={cita.horaCita} />
              </div>
              <div className='control3'>
                <input type='submit' value='Agenda' />
              </div>
          </form>
            </div>
    </div>
  );
}

export default RegistroCita;