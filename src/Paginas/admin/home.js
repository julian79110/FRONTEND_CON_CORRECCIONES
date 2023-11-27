import React, { useState,useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import axios from 'axios';


const Home = ({ userName }) => {
  const navigate = useNavigate();
  const name = localStorage.getItem('name');
  const token = localStorage.getItem('token');
  const doctorId = localStorage.getItem('doctorId');
  const [menuOpen, setMenuOpen] = useState(false);
  const [doctorData, setDoctorData] = useState(null);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('name');
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleProfileClick = async () => {
    try {
      const response = await axios.get(`http://localhost:8888/api/v1/devcamps/users/doctores/${doctorId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.data && response.data.success) {
        setDoctorData(response.data.data);
      }
    } catch (error) {
      console.error('Error al obtener datos del doctor:', error);
    }
  };
  
  

useEffect(() => {
    // Hacer la solicitud de datos del doctor cuando el componente se monta
    const fetchDoctorData = async () => {
      try {
        const response = await axios.get(`http://localhost:8888/api/v1/devcamps/users/doctores/${doctorId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data && response.data.success) {
          setDoctorData(response.data.data);
        }
      } catch (error) {
        console.error('Error al obtener datos del doctor:', error);
      }
    };

    fetchDoctorData();
  }, [token]); // Ejecutar solo cuando el token cambie


  return (
    <div>
      <nav className='menu'>
        <label className='logo'>Doctor</label>
        <ul className={`menu_items ${menuOpen ? 'show' : ''}`}>
          <li className='active'><Link to={"#"}>Inicio</Link></li>
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
      Bienvenid@: {name || 'Invitado'}
      </div>
      <div className='botonC'>
        <Link to={"/citas"}>Ver Citas</Link><br></br>
      </div>
      <div className='botonC'>
        <Link to={"/actualizar"}>Actualizar</Link><br></br>
      </div>
        </div>
  );
}

export default Home;