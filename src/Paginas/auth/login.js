import React from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <section>
        <div className='form-container'>
            <h1>Login</h1>
            <form autoComplete='off'>
                <div className='control'>
                    <label>Usuario</label>
                    <input type='text' name='name' id='name'/>
                </div>
                <div className='control'>
                    <label>Password</label>
                    <input type='password' name='pass' id='pass'/>
                </div>
                <div className='control'>
                    <input type='submit' value='ingresar'/>
                </div>
            </form>
            <div className='link'>
                <Link to={"/register"}>Registrarse</Link><br/>
                <Link to={"/home"}>Admin</Link><br/>
                <Link to={"/homeC"}>Cliente</Link>
            </div>
        </div>
    </section>
  );
}

export default Login;