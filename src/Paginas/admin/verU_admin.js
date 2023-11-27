import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import { Modal, Button, Form, Table } from 'react-bootstrap';
import axios from 'axios';

const VerU = () => {
    const [mensajeExito, setMensajeExito] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [usuarioToUpdate, setUsuarioToUpdate] = useState({});
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const abrirModalActualizar = (usuario) => {
    setUsuarioToUpdate(usuario);
    setShowModal(true);
  };

  

  const ActualizarUsuarioModal = ({ show, onHide, usuario }) => {
    const [nombre, setNombre] = useState(usuario.name);
    const [email, setEmail] = useState(usuario.email);
    const [rol, setRol] = useState(usuario.role);
  
    const handleActualizar = async () => {
      try {
        const response = await axios.put(
          `http://localhost:8888/api/v1/devcamps/users/actualizar/${usuario._id}`,
          {
            name: nombre,
            email: email,
            role: rol,
            // Otros campos que desees actualizar
          }
        );
  
        console.log('Usuario actualizado:', response.data.results);
        
        // Actualizar la lista de usuarios localmente
        const updatedUsuarios = usuarios.map((u) =>
          u._id === usuario._id ? { ...u, name: nombre, email: email, role: rol } : u
        );
        setUsuarios(updatedUsuarios);
  
        onHide(); // Cerrar la modal después de la actualización
      } catch (error) {
        console.error('Error al actualizar usuario:', error);
      }
    };
  
    return (
        <Modal show={show} onHide={onHide}>
        <Modal.Header>
          <Modal.Title><h1>Actualizar Usuario</h1></Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form autoComplete="off">
          <Form.Group controlId="formNombre">
            <Form.Label>Nombre: </Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese el nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </Form.Group><br/>

         

          <Form.Group controlId="formEmail">
            <Form.Label>Email: </Form.Label>
            <Form.Control
              type="email"
              placeholder="Ingrese el email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formRol">
            <Form.Label>Rol</Form.Label>
            <Form.Control
              as="select"
              value={rol}
              onChange={(e) => setRol(e.target.value)}
            >
              <option value="admin">Admin</option>
              <option value="doctor">Doctor</option>
              <option value="paciente">Paciente</option>
            </Form.Control>
          </Form.Group>

        </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={handleActualizar}>
            Actualizar
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  

  const handleLogout = () => {
    localStorage.removeItem('name');
    localStorage.removeItem('token');
    navigate('/');
  };

  useEffect(() => {
    // Realizar la solicitud para obtener la lista de usuarios al montar el componente
    const fetchUsuarios = async () => {
      try {
        const response = await axios.get('http://localhost:8888/api/v1/devcamps/users/listar');
        setUsuarios(response.data.data);
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
      }
    };

    fetchUsuarios();
  }, []);

  const eliminarUsuario = async (userId) => {
    const confirmacion = window.confirm("¿Estás seguro de que deseas eliminar este usuario?");
    if (confirmacion) {
    try {
      // Realizar la solicitud de eliminación
      await axios.delete(`http://localhost:8888/api/v1/devcamps/users/eliminar/${userId}`);
  
      // Actualizar la lista de usuarios después de la eliminación
      const updatedUsuarios = usuarios.filter(usuario => usuario._id !== userId);
      setUsuarios(updatedUsuarios);
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
    }
    }
  };

  

  return (
    <div>
      <nav className='menu'>
        <label className='logo'>Admin</label>
        <ul className={`menu_items ${menuOpen ? 'show' : ''}`}>
          <li className='active'><Link to={"/admin"}>Inicio</Link></li>
          <li><Link to={"/verUsuarios"}>Ver usuarios</Link></li>
          <li><button onClick={handleLogout}>Cerrar Sesion</button></li>
        </ul>
        <span className={`btn_menu ${menuOpen ? 'hide' : ''}`} onClick={toggleMenu}>
          <FaBars />
        </span>
      </nav>
      <div className="centrar">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Numero Documento</th>
              <th>Tipo De Documento</th>
              <th>Rol</th>
              <th>Eliminar</th>
              <th>Actualizar</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map(usuario => (
              <tr key={usuario._id}>
                <td>{usuario.name}</td>
                <td>{usuario.email}</td>
                <td>{usuario.numeroDoc}</td>
                <td>{usuario.tipoDoc}</td>
                <td>{usuario.role}</td>
                <td><button className="eliminar" onClick={() => eliminarUsuario(usuario._id)}>
                    Eliminar
                  </button>
                </td>
                <td>
                <button className="editar" onClick={() => abrirModalActualizar(usuario)}>
                  Actualizar
                </button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <ActualizarUsuarioModal
        show={showModal}
        onHide={() => setShowModal(false)}
        usuario={usuarioToUpdate}
      />
    </div>
  );
}

export default VerU;
