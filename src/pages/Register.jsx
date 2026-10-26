import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function Register() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [telefono, setTelefono] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post('https://canchapp-158d.vercel.app/api/usuarios/register', { nombre, email, password, telefono });
      navigate('/');
    } catch (err) {
      console.error('Error al registrarse:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'No se pudo crear la cuenta. Intentá de nuevo.');
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-brand">
        <h1>CanchApp</h1>
        <p>Creá tu cuenta y reservá en un minuto.</p>
      </div>
      <div className="auth-card">
        <h2>Registrarse</h2>
        {error && <p className="msg msg-error">{error}</p>}
        <form onSubmit={handleRegister}>
          <div className="field">
            <label htmlFor="nombre">Nombre</label>
            <input id="nombre" type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="field">
            <label htmlFor="password">Contraseña</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className="field">
            <label htmlFor="telefono">Teléfono</label>
            <input id="telefono" type="text" value={telefono} onChange={(e) => setTelefono(e.target.value)} required />
          </div>
          <button className="btn btn-full" type="submit">Crear cuenta</button>
        </form>
        <p className="auth-alt">¿Ya tenés cuenta? <Link to="/">Iniciá sesión</Link></p>
      </div>
    </div>
  );
}

export default Register;