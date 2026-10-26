import { NavLink, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  const salir = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <span className="brand">CanchApp</span>
        <nav className="nav">
          <NavLink to="/inicio">Inicio</NavLink>
          <NavLink to="/canchas">Canchas</NavLink>
          <NavLink to="/reservas">Mis reservas</NavLink>
          <button className="link-btn" onClick={salir}>Salir</button>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
