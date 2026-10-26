import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('https://canchapp-backend-4cdk-red.vercel.app/api/usuarios/login', { email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/inicio');
    } catch {
      setError('Email o contraseña incorrectos.');
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-brand">
        <h1>Bienvenidos a la Canchapp</h1>
        <p>Reservá tu cancha de pádel o pelota paleta.</p>
      </div>
      <div className="auth-card">
        <h2>Iniciar sesión</h2>
        {error && <p className="msg msg-error">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="field">
            <label htmlFor="password">Contraseña</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button className="btn btn-full" type="submit">Entrar</button>
        </form>
        <p className="auth-alt">¿No tenés cuenta? <Link to="/register">Registrate</Link></p>
      </div>
    </div>
  );
}

export default Login;
