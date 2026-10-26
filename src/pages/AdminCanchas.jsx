import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const API = 'https://canchapp-backend-4cdk-red.vercel.app/api';
const TIPOS = { padel: 'Pádel', pelota_paleta: 'Pelota paleta' };

// Trae todas las canchas de la API
const traerCanchas = () => axios.get(`${API}/canchas`).then((res) => res.data);

function AdminCanchas() {
  const [canchas, setCanchas] = useState([]);
  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState('padel');
  const [precio, setPrecio] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/');
      return;
    }
    traerCanchas()
      .then(setCanchas)
      .catch((err) => console.error(err));
  }, [navigate]);

  const handleAgregar = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');
    try {
      await axios.post(`${API}/canchas`, {
        nombre,
        tipo,
        precio_por_hora: Number(precio)
      });
      setNombre('');
      setTipo('padel');
      setPrecio('');
      setMensaje('Cancha agregada.');
      setCanchas(await traerCanchas());
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'No se pudo agregar la cancha. Intentá de nuevo.');
    }
  };

  const handleEliminar = async (cancha) => {
    if (!window.confirm(`¿Eliminar "${cancha.nombre}"?`)) return;
    setMensaje('');
    setError('');
    try {
      await axios.delete(`${API}/canchas/${cancha.id}`);
      setMensaje('Cancha eliminada.');
      setCanchas(await traerCanchas());
    } catch (err) {
      console.error(err);
      setError('No se pudo eliminar la cancha. Si ya tiene reservas, no se puede borrar.');
    }
  };

  return (
    <>
      <Navbar />
      <main className="page">
        <div className="page-head">
          <h2>Administrar canchas</h2>
          <p>Agregá canchas nuevas o eliminá las que ya no uses.</p>
        </div>

        <div className="panel" style={{ marginBottom: '28px' }}>
          {mensaje && <p className="msg msg-ok">{mensaje}</p>}
          {error && <p className="msg msg-error">{error}</p>}
          <form onSubmit={handleAgregar}>
            <div className="field">
              <label htmlFor="nombre">Nombre</label>
              <input id="nombre" type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
            </div>
            <div className="row-2">
              <div className="field">
                <label htmlFor="tipo">Tipo</label>
                <select id="tipo" value={tipo} onChange={(e) => setTipo(e.target.value)}>
                  <option value="padel">Pádel</option>
                  <option value="pelota_paleta">Pelota paleta</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="precio">Precio por hora</label>
                <input id="precio" type="number" min="0" value={precio} onChange={(e) => setPrecio(e.target.value)} required />
              </div>
            </div>
            <button className="btn btn-full" type="submit">Agregar cancha</button>
          </form>
        </div>

        <div className="seccion-head">
          <h3>Canchas cargadas</h3>
        </div>
        {canchas.length === 0 && <p className="vacio">Todavía no hay canchas cargadas.</p>}
        <div className="reservas">
          {canchas.map((c) => (
            <article key={c.id} className="reserva">
              <div className="reserva-info">
                <h3>{c.nombre}</h3>
                <p>
                  {TIPOS[c.tipo] || c.tipo} · ${Number(c.precio_por_hora).toLocaleString('es-AR')}/hora
                </p>
              </div>
              <div className="reserva-acciones">
                {c.activa === 0 && <span className="badge badge-cancelada">inactiva</span>}
                <button className="btn btn-outline" onClick={() => handleEliminar(c)}>Eliminar</button>
              </div>
            </article>
          ))}
        </div>
      </main>
    </>
  );
}

export default AdminCanchas;
