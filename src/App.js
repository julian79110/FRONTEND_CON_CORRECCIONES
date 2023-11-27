import React, {Fragment} from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Login from './Paginas/auth/login';
import Register from './Paginas/auth/register';
import Home from './Paginas/admin/home';
import Citas from './Paginas/admin/citas_admin';
import HomeC from './Paginas/clientes/home_cliente';
import RegistroCita from './Paginas/clientes/registroCitas';
import VerCitas from './Paginas/clientes/verCitas';
import HomeA from './Paginas/admin/homeA';
import ActualizarD from './Paginas/admin/actualizar';
import RegisterA from './Paginas/admin/registerA';
import VerU from './Paginas/admin/verU_admin';



function App() {
  return (
   <Fragment>
      <Router>
          <Routes>
              <Route path="/" element={<Login/>}></Route>
              <Route path="/register" element={<Register/>}></Route>
              <Route path="/home" element={<Home/>}></Route>
              <Route path="/citas" element={<Citas/>}></Route>
              <Route path="/homeC" element={<HomeC/>}></Route>
              <Route path="/registrarCitas" element={<RegistroCita/>}></Route>
              <Route path="/verCitas" element={<VerCitas/>}></Route>
              <Route path="/admin" element={<HomeA/>}></Route>
              <Route path="/actualizar" element={<ActualizarD/>}></Route>
              <Route path="/registerA" element={<RegisterA/>}></Route>
              <Route path="/verUsuarios" element={<VerU/>}></Route>
          </Routes>
      </Router>
   </Fragment>
  );
}

export default App;
